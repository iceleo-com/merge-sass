import React, { Component } from 'react';
import mergeSass from '../../index';
import styles from './App.scss';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            result: '',
        };

        this.targetRef = React.createRef();
        this.sourceRef = React.createRef();
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.form}>
                    <div>
                        <h4 className={styles.heading}>Original SCSS</h4>
                        <textarea ref={this.targetRef} defaultValue="" onChange={this.handleChange}></textarea>
                    </div>
                    <div>
                        <h4 className={styles.heading}>Updating SCSS</h4>
                        <textarea ref={this.sourceRef} defaultValue="" onChange={this.handleChange}></textarea>
                    </div>
                </div>
                <div className={styles.result}>
                    <h4 className={styles.heading}>Result</h4>
                    <textarea value={this.state.result} readOnly></textarea>
                </div>
            </div>
        );
    }

    handleChange = () => {
        const target = this.targetRef.current.value;
        const source = this.sourceRef.current.value;

        this.setState({
            ...this.state,
            result: mergeSass(target, source),
        });
    }
}

export default App;
