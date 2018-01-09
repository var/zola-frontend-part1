import React, {Component} from 'react';
import axios from 'axios';
import {Col, Container, Option, Panel, Radio, Row, Select} from "muicss/react";
import UserItem from "../components/UserItem";

class Users extends Component {

    constructor() {
        super();
        this.state = {

            originalCopy: [],
            users: [],

            categories: [],
            filter: 'all'
        }
    }

    componentDidMount() {
        this._getData();
    }

    // function to get data from json
    _getData = () => {
        let _this = this;
        axios
            .get("https://raw.githubusercontent.com/var/zola-frontend-part1/gh-pages/dummyData/users.json")
            .then(function (result) {
                _this._getCategories(result.data.data);
                _this.setState({
                    users: result.data.data,
                    originalCopy: result.data.data // maintaining a copy to save network calls
                });
            })
    };

    // function to handle the radio button changes
    _switchFilter = (ev) => {
        this.setState({filter: ev.target.value}); // set this for radio button update
        this._filterData(ev.target.value); // funtion that actually performs the filter
    };

    // filter the objects
    _filterData = (criteria) => {

        if (criteria === 'all') {
            this.setState({users: this.state.originalCopy});
        } else {
            let u = this.state.originalCopy;

            let filteredUsers = u.filter(function (item) {
                return item.category === criteria;
            });

            this.setState({users: filteredUsers});
        }
    };

    // function to retrieve all categories
    _getCategories = (users) => {
        let cat = new Set();
        users.forEach(function (u) {
            cat.add(u.category);
        });
        let catArray = Array.from(cat);
        this.setState({categories: catArray.sort()})
    };

    // function to sort users when the select changes
    _sortBy = (ev) => {
        let value = ev.target.value;

        if (value === 'priority') {
            let u = this.state.users;
            u.sort(function (a, b) {
                return a.priority - b.priority;
            });
            this.setState({users: u})

        } else if (value === 'ascending') {
            let u = this.state.users;
            u.sort(function (a, b) {
                let nameA = a.name.toUpperCase(); // ignore upper and lowercase
                let nameB = b.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            });
            this.setState({users: u})

        } else {
            this.setState({users: this.state.originalCopy});
        }
    };

    render() {
        return (
            <Container>
                <Panel className="box">
                    <Row>
                        <Col md="4"><Select name="input" label="Sort" defaultValue="featured" onChange={this._sortBy}>
                            <Option value="featured" label="Featured"/>
                            <Option value="ascending" label="A - Z"/>
                            <Option value="priority" label="Priority"/>
                        </Select>
                            <div>
                                <Radio name="filterCat" label="Display all" value='all'
                                       checked={this.state.filter === 'all'} onChange={this._switchFilter.bind(this)}/>
                                {this.state.categories.map((cat, key) => {
                                    return (
                                        <Radio name="filterCat" key={key} label={cat} value={cat}
                                               checked={this.state.filter === cat}
                                               onChange={this._switchFilter.bind(this)}/>
                                    );

                                })}</div>
                        </Col>
                        <Col md="8">
                            <Row>
                                {this.state.users.map(function (user, key) {
                                    return (
                                        <Col md="4" key={key}><UserItem user={user}/></Col>
                                    );
                                })}
                            </Row>
                        </Col>
                    </Row>
                </Panel>
            </Container>
        );
    }
}

export default Users;
