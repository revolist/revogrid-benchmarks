import { Table } from "./ReactTable";
import { type Root, createRoot } from 'react-dom/client';

export class ReactConnector {

    root:Root;

    constructor(targetEl:HTMLElement){
        console.log("targetEl", targetEl)
        this.root = createRoot(targetEl);
    }

    render(){
        this.root.render(<Table/>)
    }
}