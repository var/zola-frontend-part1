import React, {Component} from 'react';

class UserItem extends Component {

    render() {
        return (
            <div className={`card priority-${this.props.user.priority}`}>
                <h2 className="card-name">{this.props.user.name}</h2>
                <p className="card-age">{this.props.user.age}</p>
                <p className="card-category">{this.props.user.category}</p>
            </div>
        );
    }
}

export default UserItem;
