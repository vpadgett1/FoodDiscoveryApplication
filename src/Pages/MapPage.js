import '../App.css';
import React from 'react';
import Navigation from '../Components/Navigation';


class MapPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <>
                <Navigation />
            </>
        );
    }
}

export default MapPage;
