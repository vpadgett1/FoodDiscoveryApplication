import '../App.css';
import React from 'react';
import { Link } from 'react-router-dom';


class CreateAccountPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    //TODO: fetch data from backend
    componentDidMount() {

    }

    render() {
        return (
            <>
                <Link to="/onboarding">Regular User</Link>
                <Link to="/merchant">Merchant User</Link>
                <div>This is the create account page</div>
            </>
        )
    }
}

export default CreateAccountPage;
