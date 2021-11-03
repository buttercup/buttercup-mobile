import React from "react";
import AnimatedProgressWheel from "react-native-progress-wheel";

interface CodeWheelProps {
    period: number;
    timeLeft: number;
}

function codeColour(percent: number): string {
    if (percent < 20) {
        return "#fb6962";
    } else if (percent < 40) {
        return "#fcfc99";
    }
    return "#79de79";
}

export function CodeWheel(props: CodeWheelProps) {
    const percent = (props.timeLeft / props.period) * 100;
    return (
        <AnimatedProgressWheel
            size={40}
            width={5}
            color={codeColour(percent)}
            progress={percent}
            backgroundColor={"grey"}
        />
    );
}
