import '../App.css';
import React from 'react';
import LandingPageNavigation from '../Components/LandingPageNavigation';

class LandingPage extends React.Component {

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
                <LandingPageNavigation />
                <div>Landing Page</div>
            </>
        );
    }
}

export default LandingPage;
