"use strict";
exports.__esModule = true;
var core_1 = require("@material-ui/core");
var react_1 = require("react");
function PrdictGrid(props) {
    var steps = [
        "Predict anchor candidates",
        "Predict anchor pairs",
        "Visualize Loops"
    ];
    var _a = react_1.useState(0), activeStep = _a[0], setActiveStep = _a[1];
    var _b = react_1.useState(rows_data), rows = _b[0], setRows = _b[1];
    var handleStep = function (step) { return function () {
        setActiveStep(step);
    }; };
    return (React.createElement(React.Fragment, null,
        React.createElement(core_1.Stepper, { nonLinear: true, activeStep: activeStep, style: { fontSize: "large" } }, steps.map(function (label, index) { return (React.createElement(core_1.Step, { key: label },
            React.createElement(core_1.StepButton, { onClick: handleStep(index) }, label))); })),
        React.createElement(core_1.Grid, { container: true },
            React.createElement(core_1.Grid, { container: true, item: true },
                React.createElement(UploadButton, null),
                React.createElement(PredictBox, null),
                React.createElement(NextButton, null)),
            React.createElement(core_1.Grid, null,
                React.createElement(DataGrid, null)))));
}
exports["default"] = PrdictGrid;
