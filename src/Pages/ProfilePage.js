import '../App.css';
import React from 'react';
import Navigation from '../Components/Navigation';

class ProfilePage extends React.Component {

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
                <div>This is the profile page</div>
            </>
        );
    }
}

export default ProfilePage;
