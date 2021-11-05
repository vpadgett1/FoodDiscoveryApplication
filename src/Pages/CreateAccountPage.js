import '../App.css';
import React from 'react';
import { Link } from 'react-router-dom';


class CreateAccountPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <>
                <Link to="/discover">Regular User</Link>
                <Link to="/merchant">Merchant User</Link>
            </>
        )
    }
}

export default CreateAccountPage;
