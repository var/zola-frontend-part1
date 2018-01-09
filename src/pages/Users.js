import React, {Component} from 'react';
import axios from 'axios';
import {Button, Col, Container, Option, Panel, Row, Select} from "muicss/react";
import UserItem from "../components/UserItem";

class Users extends Component {

    constructor() {
        super();
        this.state = {
            users: [],
            categories: []
        }
    }

    _getData = () => {
        let _this = this;
        let host = window.location.hostname;
        axios
            .get("http://" + host + ":3000/dummyData/users.json")
            .then(function (result) {
                _this._getCategories(result.data.data);
                _this.setState({
                    users: result.data.data
                });
            })
    };

    _filterData = (criteria, e) => {
        if (criteria === 'all'){
            this._getData();
        } else {
            this._getData();
            let users = this.state.users;
            users.filter(u => u.category === criteria);
            this.setState({users: users});
        }
    };

    _getCategories = (users) => {
        let cat = new Set();
        users.forEach(function(u) {
            cat.add(u.category);
        });
        let catArray = Array.from(cat);
        this.setState({categories: catArray.sort()})
    };

    _sortBy = (ev) => {
        let value = ev.target.value;

        if (value === 'priority'){
            let u = this.state.users;
            u.sort(function(a, b) {
                return a.priority - b.priority;
            });
            this.setState({users: u})

        } else if ( value === 'ascending') {
            let u = this.state.users;
            u.sort(function(a, b) {
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
            this._getData();
        }
    };

    componentWillMount() {
        this._getData();
    }

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
                            {this.state.categories.map((cat, key) => {

                                    <Col md="4" key={key}><p>
                                        <Button value={cat}
                                            onClick={this._filterData.bind(this, c)}
                                        >{cat}
                                        </Button>
                                    </p></Col>

                            })}
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
