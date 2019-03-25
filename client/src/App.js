import React, {Component} from "react";
import Equivalents from "./contracts/Equivalents.json";
import getWeb3 from "./utils/getWeb3";
import "./App.css";
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import ReactTable from 'react-table'
import "react-table/react-table.css";
import logo from './logo.svg';
import {range, forEach, filter, sortBy, size} from "lodash"

let data = [];

let indexes = [];

const columns = [
    {
        Header: "Index",
        accessor: 'index',
    },
    {
        Header: "Description",
        accessor: 'description',
    },
    {
        Header: "Name",
        accessor: 'name',
    },
];

class App extends Component {
    state = {
        storageValue: 0,
        web3: null,
        accounts: null,
        contract: null,
        selectedIndex: null,
    };

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Equivalents.networks[networkId];
            console.log("deployedNetwork.address", deployedNetwork.address);
            const instance = new web3.eth.Contract(
                Equivalents.abi,
                deployedNetwork && deployedNetwork.address,
            );

            this.setState({web3, accounts, contract: instance}, this.update);

            instance.events.allEvents({fromBlock: "latest"}).on("data", this.update);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    update = async () => {
        const {accounts, contract} = this.state;

        const countRecords = (await contract.methods.countRecords().call());

        data = [];

        const tasks = range(countRecords).map(async (e) => {
                const response = await contract.methods.getRecord(e).call();

                data.push({
                    index: e,
                    address: response["0"],
                    name: response["1"],
                    description: response["2"],
                });
        });

        await Promise.all(tasks);

        data = sortBy(data, ["index"]);

        indexes = filter(data, ["address", accounts[0]]).map((e)=>e.index);

        this.forceUpdate();
    };

    addRecord = async (name, description) => {
        const {accounts, contract} = this.state;

        await contract.methods.add(name, description).send({from: accounts[0]});
    };

    editRecord = async (index, name, description) => {
        console.log("index", index);
        const {accounts, contract} = this.state;

        await contract.methods.edit(index, name, description).send({from: accounts[0]});
    };

    selectIndex = (arg) => {
        this.setState({
            selectedIndex: arg.value
        });
        document.getElementById('changedName').value = filter(data, {"index": arg.value})[0].name;
        document.getElementById('changedDescription').value = filter(data, {"index": arg.value})[0].description;
    };

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }

        return (
            <div className="App">
                <div className="PageHeader">
                    <img src={logo} className="Logo"/>
                    <h1 className="HeaderTitle">Equivalents registry</h1>
                </div>

                <hr className="style1"/>

                <div className="PanelBlock">
                    <div>New record:</div>
                    <div className="PanelRow">
                        <h5>Name:</h5>
                        <input className="InputTextElement" type="text" id="newName"/>
                        <h5>Description:</h5>
                        <input className="InputTextElement" type="text" id="newDescription"/>
                        <button className="PrimaryButton"
                                onClick={async () => {
                                    await this.addRecord(
                                        document.getElementById('newName').value,
                                        document.getElementById('newDescription').value)
                                }}>
                            <span>ADD</span>
                        </button>
                    </div>
                </div>

                <hr className="style1"/>

                <div className="PanelBlock">
                    <div>Edit record:</div>
                    <div className="PanelRow">
                        <h5>Index:</h5>

                        <Dropdown id="SelectedIndex"
                                  className="ComboBoxElement"
                                  options={indexes}
                                  placeholder={!!this.state.selectedIndex ? this.state.selectedIndex : "0"}
                                  onChange={this.selectIndex}
                        />

                        <h5>Name:</h5>
                        <input className="InputTextElement" type="text" id="changedName"/>
                        <h5>Description:</h5>
                        <input className="InputTextElement" type="text" id="changedDescription"/>
                        <button className="PrimaryButton"
                                onClick={async () => {
                                    await this.editRecord(
                                        this.state.selectedIndex,
                                        document.getElementById('changedName').value,
                                        document.getElementById('changedDescription').value)
                                }}>
                            <span>EDIT</span>
                        </button>
                    </div>
                </div>

                <div className="EquivalentsListContainer">
                    <ReactTable
                        data={data}
                        columns={columns}
                        className="-striped -highlight"
                        showPagination={false}
                        showPaginationBottom={false}
                        pageSize={size(data)}
                        showPageJump={false}
                    />
                </div>
            </div>
        );
    }
}

export default App;
