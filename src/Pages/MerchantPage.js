import '../App.css';
import React from 'react';


class MerchantPage extends React.Component {
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
                <div>Merchant Page</div>
                <div>This is the merchant page</div>
            </>
        );
    }
}

export default MerchantPage;
