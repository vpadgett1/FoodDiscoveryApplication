import '../App.css';
import React from 'react';
import Navigation from '../Components/Navigation';

class SearchPage extends React.Component {

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
                <div>This is the search page</div>
            </>
        );
    }
}

export default SearchPage;
