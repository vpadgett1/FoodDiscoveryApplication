import '../App.css';
import React from 'react';
import Navigation from '../Components/Navigation';


class MapPage extends React.Component {

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
                <div>This is the map page</div>
            </>
        );
    }
}

export default MapPage;
