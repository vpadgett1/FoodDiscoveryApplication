import '../App.css';
import React from 'react';
import { Link } from 'react-router-dom';

class OnboardingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.createAccount = this.createAccount.bind(this);
        this.showErrors = this.showErrors.bind(this);
    }

    //TODO: fetch data from backend
    componentDidMount() {

    }

    // TODO: This method should post the user data for a new user
    // after the user answers onboarding questions
    createAccount() {

    }

    // TODO: This method should display an error if the user is 
    // unable to create an account
    showErrors() {

    }

    render() {
        return (
            <>
                <div>this is an onboarding page</div>
                <Link to="/discover">Continue</Link>
            </>
        )
    }
}

export default OnboardingPage;
