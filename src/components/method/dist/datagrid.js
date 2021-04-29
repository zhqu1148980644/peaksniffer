"use strict";
exports.__esModule = true;
var react_1 = require("react");
var core_1 = require("@material-ui/core");
var styles = function (theme) { return ({}); };
function Empty(props) {
    return React.createElement("div", null);
}
var split = {
    render: null
};
var columns = {
    control: {
        headerRender: null,
        rowRender: null
    },
    chrom: {
        headerRender: null,
        rowRender: null
    },
    start: {
        headerRender: null,
        rowRender: null
    },
    end: {
        headerRender: null,
        rowRender: null
    },
    GM12878: {
        headerRender: null,
        rowRender: null
    },
    HELA: {
        headerRender: null,
        rowRender: null
    },
    K562: {
        headerRender: null,
        rowRender: null
    },
    IMR90: {
        headerRender: null,
        rowRender: null
    }
};
var rows_data = [
    { control: "", chrom: "str1", start: 100, end: 100000, GM12878: "93%", HELA: "87%", K562: "25%", IMR90: "45%" },
    { control: "", chrom: "str1", start: 100, end: 100000, GM12878: "93%", HELA: "87%", K562: "25%", IMR90: "45%" },
    { control: "", chrom: "str1", start: 100, end: 100000, GM12878: "93%", HELA: "87%", K562: "25%", IMR90: "45%" },
    { control: "", chrom: "str1", start: 100, end: 100000, GM12878: "93%", HELA: "87%", K562: "25%", IMR90: "45%" },
    { control: "", chrom: "str1", start: 100, end: 100000, GM12878: "93%", HELA: "87%", K562: "25%", IMR90: "45%" },
    { control: "", chrom: "str1", start: 100, end: 100000, GM12878: "93%", HELA: "87%", K562: "25%", IMR90: "45%" },
    { control: "", chrom: "str1", start: 100, end: 100000, GM12878: "93%", HELA: "87%", K562: "25%", IMR90: "45%" },
    { control: "", chrom: "str1", start: 100, end: 100000, GM12878: "93%", HELA: "87%", K562: "25%", IMR90: "45%" },
    { control: "", chrom: "str1", start: 100, end: 100000, GM12878: "93%", HELA: "87%", K562: "25%", IMR90: "45%" },
    { control: "", chrom: "str1", start: 100, end: 100000, GM12878: "93%", HELA: "87%", K562: "25%", IMR90: "45%" },
    { control: "", chrom: "str1", start: 100, end: 100000, GM12878: "93%", HELA: "87%", K562: "25%", IMR90: "45%" },
    { control: "", chrom: "str1", start: 100, end: 100000, GM12878: "93%", HELA: "87%", K562: "25%", IMR90: "45%" },
    { control: "", chrom: "str1", start: 100, end: 100000, GM12878: "93%", HELA: "87%", K562: "25%", IMR90: "45%" },
];
function DataGrid(props) {
    var _a = react_1.useState({ rows_data: rows_data }), rows = _a[0], setRows = _a[1];
    return (React.createElement(core_1.Grid, null));
}
exports["default"] = core_1.withStyles(styles, { withTheme: true })(DataGrid);
