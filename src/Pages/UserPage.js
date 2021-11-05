import '../App.css';
import React from 'react';
import Navigation from '../Components/Navigation';

class UserPage extends React.Component {
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
                <Navigation />
                <div>this is a user profile</div>
            </>
        )
    }
}

export default UserPage;
