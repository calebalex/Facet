import React, {useEffect, useRef} from 'react';
import {Text, View, Animated, Easing} from 'react-native';
import AuthComponent from './AuthComponent';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {RotateInDownLeft, RotateOutDownLeft } from 'react-native-reanimated';

const LoadingIndicator = (props) => {
    const spinValue = new Animated.Value(0);

    useEffect(() => {
        Animated.loop(
            Animated.timing(
                spinValue,
                {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true
                }
            )
        ).start()
    }, [spinValue, 1]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });
    return (
        <View style={{alignContent: "center", justifyContent: "center", flex: 1}}>
            <Animated.View  style={{alignSelf: "center", width: 50, height: 50,transform: [{rotate: spin}] }}>
                <View style={{borderWidth: 5,borderColor: "#dddddd", borderTopColor: props.color, width: "100%", height: "100%", borderRadius: 50}}>

                </View>
            </Animated.View>
        </View>
    );
  };

export default LoadingIndicator;