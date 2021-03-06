import 'date-fns';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { Grid, Button } from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { api } from '../../config/globals';

export default class OrderForm extends Component {
  static propTypes = {
    postId: PropTypes.string,
    mode: PropTypes.string,
    onFinish: PropTypes.func,
    loadPosts: PropTypes.func,
    fullWidth: PropTypes.bool,
  };

  state = {
    name: '',
    phone: '',
    email: '',
    time: new Date(),
    numOfPeople: '',
    submitted: false,
  };

  // check if usee is editing, if yes, fill all fields
  componentDidMount() {
    const { mode } = this.props;
    if (mode === 'edit') {
      const { postId } = this.props;
      fetch(`${api}/orders/${postId}`)
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Get post failed!');
          }
          return res.json();
        })
        .then(resData => {
          const { name, phone, email, time, numOfPeople } = resData;
          this.setState({
            name,
            phone,
            email,
            time,
            numOfPeople,
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  // grape input value and setState
  handleChange = event => {
    const { target } = event;
    this.setState({ [target.name]: target.value });
  };

  // grape time select value and setState
  handleTimeChange = time => {
    this.setState({ time });
  };

  // create an new order
  // run onFinish? function from props
  // run loadPosts? from props
  // send email to emailJS
  handleSubmit = event => {
    event.preventDefault();
    const { onFinish, loadPosts } = this.props;
    const { name, phone, email, time, numOfPeople } = this.state;
    fetch(`${api}/orders/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        phone,
        email,
        time,
        numOfPeople,
      }),
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Create failed!');
        }
        res.json();
      })
      .then(() => {
        this.sendEmail();
        if (onFinish) {
          onFinish();
        }
        this.setState({ submitted: true }, () => {
          setTimeout(() => {
            this.setState({
              submitted: false,
              name: '',
              phone: '',
              email: '',
              time: new Date(),
              numOfPeople: '',
            });
          }, 2000);
        });

        if (loadPosts) {
          loadPosts();
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  // update an new order
  // run onFinish, loadPosts function from props
  handleUpdate = event => {
    event.preventDefault();
    const { postId, onFinish, loadPosts } = this.props;
    const { name, phone, email, time, numOfPeople } = this.state;
    fetch(`${api}/orders/update/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        phone,
        email,
        time,
        numOfPeople,
      }),
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Edit failed!');
        }
        res.json();
      })
      .then(() => {
        this.setState({ submitted: true }, () => {
          setTimeout(() => {
            this.setState({ submitted: false });
            onFinish();
          }, 500);
        });
        loadPosts();
      })
      .catch(err => {
        console.log(err);
      });
  };

  // prepare required data for EmailJs and send
  sendEmail = () => {
    const { name, phone, email, time, numOfPeople } = this.state;
    const data = {
      service_id: process.env.REACT_APP_SERVICE_ID,
      template_id: process.env.REACT_APP_TEMPLATE_ID,
      user_id: process.env.REACT_APP_USER_ID,
      template_params: {
        name,
        phone,
        email,
        time,
        numOfPeople,
      },
    };
    fetch(`https://api.emailjs.com/api/v1.0/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Send email failed!');
        }
        console.log(res);
        res.json();
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { mode, fullWidth } = this.props;
    const { name, phone, email, time, numOfPeople, submitted } = this.state;

    return (
      <ValidatorForm
        // check is updating or creating
        onSubmit={mode === 'edit' ? this.handleUpdate : this.handleSubmit}
      >
        <Grid container direction="column" justify="center" alignItems="center">
          <TextValidator
            label="Name"
            fullWidth={fullWidth || null}
            value={name}
            onChange={this.handleChange}
            type="text"
            name="name"
            id="name"
            validators={['required']}
            errorMessages={['Name is required']}
          />
          <TextValidator
            label="Guests"
            fullWidth={fullWidth || null}
            value={numOfPeople}
            onChange={this.handleChange}
            type="number"
            min="1"
            name="numOfPeople"
            id="numOfPeople"
            validators={['required', 'minNumber:0', 'maxNumber:255']}
            errorMessages={[
              'This field is required',
              'Number should greater then 0',
              'Number should smaller then 255',
            ]}
          />
          <TextValidator
            label="Phone Number"
            fullWidth={fullWidth || null}
            value={phone}
            onChange={this.handleChange}
            type="text"
            name="phone"
            id="phone"
            validators={['required']}
            errorMessages={['Phone is required', 'Phone is not valid']}
          />

          <TextValidator
            label="Email"
            fullWidth={fullWidth || null}
            value={email}
            onChange={this.handleChange}
            type="email"
            name="email"
            id="email"
            validators={['required', 'isEmail']}
            errorMessages={['Email is required', 'Email is not valid']}
          />

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              fullWidth={fullWidth || null}
              name="time"
              id="date-picker-dialog"
              label="Select Your Date"
              format="MM/dd/yyyy"
              value={time}
              onChange={this.handleTimeChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardTimePicker
              fullWidth={fullWidth || null}
              name="time"
              id="time-picker"
              label="Select your Time"
              value={time}
              onChange={this.handleTimeChange}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
          </MuiPickersUtilsProvider>

          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={submitted}
          >
            {(submitted && 'Your form is submitted!') ||
              (!submitted && 'Submit')}
          </Button>
        </Grid>
      </ValidatorForm>
    );
  }
}
