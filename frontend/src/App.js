import React from 'react';
import axios from 'axios';
// import RadioCheckBox from './RadioCheckBox';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, FormGroup, Checkbox, List } from '@mui/material';

class App extends React.Component {

    constructor(){
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
    }
  
    componentDidMount() {
        let data ;
        axios.get('http://localhost:8000/mcqs/')
        .then(res => {
            data = res.data;
            this.setState({
                details : data
            });
        
        })
        .catch(err => {console.log(err)})
        // this.fillInStateValue()
    }

    handleRadioChange = (event) => {
        let answers = this.state.value;
        answers[this.id][this.state.question_num] = event.target.value;
        this.setState({
            value: answers
        });
    }

    handleCheckBoxChange = (event, index) => { // [1, 2, [1, 2], 3]
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

    GetRadioCheckBoxCode = () => {
        const elements = []
        let choice = String(this.state.details[this.state.question_num].choices).split(" ").slice(0, -1);
        let correct_ans = String(this.state.details[this.state.question_num].correct_answers).split(" ").slice(0, -1);
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
    
    next = (event) => {
        this.setState({
            question_num: this.state.question_num+1
        })
    }

    calcTotScore = () => {
        let correctPoints = 0;
        correct_answers = String(this.state.details[this.state.question_num].correct_answers).split(" ").slice(0, -1);
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

    submit = (event) => {
        let score = this.calcTotScore();
        return score
    }

    handleRadioCheckBox = (radioCheckboxCode) => {
        let length = radioCheckboxCode[1];
        radioCheckboxCode = radioCheckboxCode[0];
        return (
            <>{length === 1 &&
            <FormGroup>
                <FormControl component="fieldset">
                <FormLabel component="legend">Choices:</FormLabel>
                    <RadioGroup
                        aria-label="gender"
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
      return(
            <div>
            <h1>{thisQues.ques_desc}</h1>
            {this.handleRadioCheckBox(this.GetRadioCheckBoxCode())}
            <>{this.state.question_num < this.state.details.length-1 &&
                <button onClick={this.next}> Next </button>
            }
            {this.state.question_num >= this.state.details.length-1 &&
                <div>
                <button onClick={this.submit}> Submit </button>
                </div>
            }
            </>
            </div>
        );
  }
}
  
export default App;
