import React from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, FormGroup, Checkbox, List } from '@mui/material';
import * as d3 from 'd3';
import file from './file.csv';

class App extends React.Component {

    constructor() {
        super();
        this.id = 123;
        this.state = {
            details : [{}],
            question_num : 0,
            choice_index: 0,
            choices: [],
            value: {}
        }
        let answers = this.state.value;
        answers[this.id] = {};
        this.setState({
            value: answers
        });
        this.readCsv = this.readCsv.bind(this);
        this.readCsv();
    }

    readCsv() {
        d3.csv(file)
        .then(file => {
            this.setState({
                details : file
            });
            console.log(file);
        })
        .catch(err => {console.log("error")});
    }

    handleRadioChange(event) {
        let answers = this.state.value;
        answers[this.id][this.state.question_num] = event.target.value;
        this.setState({
            value: answers
        });
    }

    handleCheckBoxChange(event, index) {
        let answers = this.state.value;
        let choice = String(this.state.details[this.state.question_num].choices).split(" ").slice(0, -1)[index];
        try {
            if (event.target.value === 'on') answers[this.id][this.state.question_num].push(choice);
            else
            {
                let thisQuestion = answers[this.id][this.state.question_num]
                answers[this.id][this.state.question_num] = thisQuestion.splice(thisQuestion.indexOf(choice), 1);
            }
        } catch (error) {
            answers[this.id][this.state.question_num] = [choice];
        }
        this.setState({
            value: answers
        });
    }

    GetRadioCheckBoxCode() {
        const elements = [];
        let choice = [ this.state.details[this.state.question_num]['a'], this.state.details[this.state.question_num]['b'], this.state.details[this.state.question_num]['c'], this.state.details[this.state.question_num]['d'] ];
        let correct_ans = String(this.state.details[this.state.question_num]['correct_answers']).split("&");
        for (let i = 0; i < choice.length; i++) {
            <>{ correct_ans.length === 1 &&
            elements.push(
            <FormControlLabel value={choice[i]} control={<Radio />} label={choice[i]} />
            ) }
            { correct_ans.length > 1 &&
            elements.push(
                <FormControlLabel control={<Checkbox onChange={(e) => this.handleCheckBoxChange(e, i)}/>} label={choice[i]} />
            ) }
            </>
        }
        return [ elements, correct_ans.length ];
      }

    next(event) {
        this.setState({
            question_num: this.state.question_num+1
        })
    }

    calcTotScore() {
        let correctPoints = 0;
        let correct_answers = String(this.state.details[this.state.question_num].correct_answers).split(" ").slice(0, -1);
        correct_answers.sort();
        let answers = this.state.value;
        answers.sort();
        for (let question_num = 0; question_num < this.details.length; question_num++)
        {
            if (correct_answers === answers) correctPoints += this.state.details[question_num].correct_points;
            else correctPoints += this.state.details[question_num].wrong_points;
        }
        return correctPoints;
    }

    submit(event) {
        let score = this.calcTotScore();
        return score
    }

    handleRadioCheckBox(radioCheckboxCode) {
        let length = radioCheckboxCode[1];
        radioCheckboxCode = radioCheckboxCode[0];
        return (
            <>{length === 1 &&
            <FormGroup>
                <FormControl component="fieldset">
                <FormLabel component="legend">Choices:</FormLabel>
                    <RadioGroup
                        aria-label="choices"
                        name="choices"
                        onChange={this.handleRadioChange}
                    >
                    {radioCheckboxCode}
                    </RadioGroup>
                </FormControl>
            </FormGroup>
            }
            {length > 1 &&
            <FormGroup>
                {radioCheckboxCode}
            </FormGroup> }
            </>
        );
    }

  render() {
      let thisQues = this.state.details[this.state.question_num];
      let code = this.handleRadioCheckBox(this.GetRadioCheckBoxCode());
      return(
            <div>
            <h1>{thisQues['ques_desc']}</h1>
            {code}
            <>{this.state.question_num < this.state.details.length-1 &&
                <button onClick={this.next}> Next </button>
            }
            {this.state.question_num >= this.state.details.length-1 &&
                <button onClick={this.submit}> Submit </button>
            }
            </>
            </div>
        );
  }
}

export default App;
