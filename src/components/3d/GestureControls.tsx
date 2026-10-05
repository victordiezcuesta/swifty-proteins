import {ReactNode, useRef} from 'react';
import {PanResponder, StyleSheet, View} from 'react-native';

type TouchPoint = {
    pageX: number;
    pageY: number;
};

type GestureControlsProps = {
    children: ReactNode;
    onRotate: (dx: number, dy: number) => void;
    onZoom: (scale: number) => void;
};

function copyTouches(touches: readonly TouchPoint[]): TouchPoint[]
{
    return touches.map(touch => ({pageX: touch.pageX, pageY: touch.pageY}));
}

export default function GestureControls({children, onRotate, onZoom}: GestureControlsProps)
{
    const previousTouches = useRef<TouchPoint[]>([]);

    const responder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: event =>
            {
                previousTouches.current = copyTouches(event.nativeEvent.touches);
            },

            onPanResponderMove: event =>
            {
                const touches = event.nativeEvent.touches;
                const previous = previousTouches.current;

                // Si cambia el número de dedos, reiniciamos la referencia
                // para evitar saltos.
                if (touches.length !== previous.length)
                {
                    previousTouches.current = copyTouches(touches);
                    return;
                }

                if (touches.length === 1)
                {
                    onRotate(
                        touches[0].pageX - previous[0].pageX,
                        touches[0].pageY - previous[0].pageY,
                    );
                }
                else if (touches.length >= 2)
                {
                    const currentDistance = Math.hypot(
                        touches[0].pageX - touches[1].pageX,
                        touches[0].pageY - touches[1].pageY,
                    );

                    const previousDistance = Math.hypot(
                        previous[0].pageX - previous[1].pageX,
                        previous[0].pageY - previous[1].pageY,
                    );

                    if (previousDistance > 0)
                        onZoom(currentDistance / previousDistance);
                }

                previousTouches.current = copyTouches(touches);
            },

            onPanResponderRelease: () => { previousTouches.current = []; },
            onPanResponderTerminate: () => { previousTouches.current = []; },
        }),
    ).current;

    return (
        <View style={styles.container}>
            {children}
            <View style={styles.gestureLayer} {...responder.panHandlers} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1},
    gestureLayer: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'transparent',
    },
});