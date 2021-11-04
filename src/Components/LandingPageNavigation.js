import '../App.css';
import React from 'react';
import { Link } from 'react-router-dom';

class LandingPageNavigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <>
                <Link to="/createAccount">Create Account</Link>
                <Link to="/discover">Log in</Link>
            </>
        )
    }
}

export default LandingPageNavigation;
