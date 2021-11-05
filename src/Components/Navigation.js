import '../App.css';
import React from 'react';
import { Link } from 'react-router-dom';

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <>
                <Link to="/discover">Discover</Link>
                <Link to="/search">Search</Link>
                <Link to="/map">Map</Link>
                <Link to="/profile">Profile</Link>
            </>
        )
    }
}

export default Navigation;
