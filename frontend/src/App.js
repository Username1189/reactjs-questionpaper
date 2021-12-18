import React from 'react';
import axios from 'axios';
// import RadioCheckBox from './RadioCheckBox';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, FormGroup, Checkbox, List } from '@mui/material';

class App extends React.Component {

    constructor(){
        super();
        this.state = {
            details : [{}],
            question_num : 0,
            choice_index: 0,
            choices: [],
            value: []
        }
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
        this.fillInStateValue()
    }

    handleRadioChange = (event) => {
        const value = this.state.value;
        value[this.state.question_num] = event.target.value;
        this.setState({
            value: value
        });
    }

    handleCheckBoxChange = (event, index) => {
        const value = this.state.value;
        let IN = index in value[this.state.question_num];
        if (IN) value[this.state.question_num][index] = event.target.value;
        value[this.state.question_num][index] = event.target.value;
        this.setState({
            value: value
        })
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

    }

    submit = (event) => {
        return this.calcTotScore();
    }

    handleRadioCheckBox = (radioCheckboxCode, length) => {
        return (
            <>{length === 1 &&
                <FormControl component="fieldset">
                <FormLabel component="legend">Choices:</FormLabel>
                    <RadioGroup
                        aria-label="gender"
                        name="choices"
                        onChange={this.handleRadioChange}
                    >
                    {radioCheckboxCode}
                    </RadioGroup>
            </FormControl> }
            {length > 1 && 
            <FormGroup>
                {radioCheckboxCode}
            </FormGroup> }
            </>
        );
    }

    fillInStateValue = () => {
        const value = this.state.value;
        for (let i = 0; i < this.state.details.length; i++)
        {
            let length = String(this.state.details[this.state.question_num].correct_answers).split(" ").length-1;
            if (length > 1)
            {
                value[i] = {};
            }
        }
        this.setState({
            value: value
        });
    }

  render() {
      let thisQues = this.state.details[this.state.question_num];
      return(
            <div>
            <h1>{thisQues.ques_desc}</h1>
            {this.handleRadioCheckBox(this.GetRadioCheckBoxCode()[0], this.GetRadioCheckBoxCode()[1])}
            <>{this.state.question_num < this.state.details.length-1 &&
                <button onClick={this.next}> Next </button>
            }
            {this.state.question_num >= this.state.details.length-1 &&
                <div>
                <button onClick={this.submit}> Submit </button>
                </div>
            }
            </>
            
            {console.log(this.state.value)}
            </div>
        );
  }
}
  
export default App;
