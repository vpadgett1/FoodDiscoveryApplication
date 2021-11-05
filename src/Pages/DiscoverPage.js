import '../App.css';
import React from 'react';
import Navigation from '../Components/Navigation';


class DiscoverPage extends React.Component {

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
                <div>This is the discover page</div>
            </>
        );
    }
}

export default DiscoverPage;
