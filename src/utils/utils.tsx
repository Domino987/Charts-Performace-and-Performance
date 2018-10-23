    /**
     * Formats the text of the Hint from the hovering Datapoint
     *
     * @private
     * @param {GraphDataPoint} point The selected datapoint to display
     * @returns {Array<{title: string, value: string}>} An array of objects to represent the Hint. Must contain title and value
     * @memberof Interactive
     */
    export function formatHint(point: IDatapoint): [{ title: string, value: string }] {
    return [{ title: point.x.toDateString(), value: point.y.toString() }];
}