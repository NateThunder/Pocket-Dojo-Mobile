import React, { useRef } from "react";
import { Animated, ViewStyle } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from "react-native-gesture-handler";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  contentSize?: { width: number; height: number };
};

export default function ZoomableContainer({ children, style, contentSize }: Props) {
  const baseScale = useRef(new Animated.Value(1)).current;
  const pinchScale = useRef(new Animated.Value(1)).current;
  const scale = Animated.multiply(baseScale, pinchScale);
  const lastScale = useRef(1);

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastOffset = useRef({ x: 0, y: 0 });

  const panRef = useRef(null);
  const pinchRef = useRef(null);

  const onPinchEvent = Animated.event([{ nativeEvent: { scale: pinchScale } }], {
    useNativeDriver: true,
  });

  const onPinchStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastScale.current *= event.nativeEvent.scale;
      baseScale.setValue(lastScale.current);
      pinchScale.setValue(1);
    }
  };

  const onPanEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onPanStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastOffset.current = {
        x: lastOffset.current.x + event.nativeEvent.translationX,
        y: lastOffset.current.y + event.nativeEvent.translationY,
      };
      translateX.setOffset(lastOffset.current.x);
      translateX.setValue(0);
      translateY.setOffset(lastOffset.current.y);
      translateY.setValue(0);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler
        ref={panRef}
        simultaneousHandlers={pinchRef}
        onGestureEvent={onPanEvent}
        onHandlerStateChange={onPanStateChange}
      >
        <Animated.View style={{ flex: 1 }}>
          <PinchGestureHandler
            ref={pinchRef}
            simultaneousHandlers={panRef}
            onGestureEvent={onPinchEvent}
            onHandlerStateChange={onPinchStateChange}
          >
            <Animated.View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                transform: [
                  { translateX },
                  { translateY },
                  { translateX: -(contentSize?.width ?? 0) / 2 },
                  { translateY: -(contentSize?.height ?? 0) / 2 },
                  { scale },
                  { translateX: (contentSize?.width ?? 0) / 2 },
                  { translateY: (contentSize?.height ?? 0) / 2 },
                ],
              }}
            >
              <Animated.View style={style}>{children}</Animated.View>
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}
