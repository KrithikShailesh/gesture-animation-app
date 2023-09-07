import { StatusBar } from "expo-status-bar";
import {
  Animated,
  Dimensions,
  Easing,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { description, imageData, verticalFlatListData } from "../data.js";
import { useEffect, useRef, useState } from "react";
import {
  Directions,
  FlingGestureHandler,
  FlatList,
} from "react-native-gesture-handler";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export default function Index() {
  const LOAD_VALUE = 1;
  let data = imageData;

  const [remainingCount, setRemainingCount] = useState(
    data.length - LOAD_VALUE
  );
  const [visibleData, setVisibleData] = useState(data.slice(0, LOAD_VALUE));
  const [startIndex, setStartIndex] = useState(0);
  const [toggleModal, setToggleModal] = useState(true);
  const [showFullText, setShowFullText] = useState(false);

  const yAxis = useRef(new Animated.Value(0)).current;
  const verticalFlatListRef = useRef(null);

  useEffect(() => {
    //scrolling to the first instance where the last chat value is true
    let indexOfLastChat = verticalFlatListData.findIndex((value, index) => {
      return value.lastChat === true;
    });
    setTimeout(() => {
      verticalFlatListRef.current.scrollToIndex({ index: indexOfLastChat });
    }, 2000);
  }, []);

  const loadMoreItems = () => {
    const newStartIndex = startIndex + LOAD_VALUE;
    const newVisibleData = data.slice(
      newStartIndex,
      newStartIndex + LOAD_VALUE
    );

    if (newVisibleData.length > 0) {
      setVisibleData([...visibleData, ...newVisibleData]);
      setStartIndex(newStartIndex);
      setRemainingCount(data.length - visibleData.length);
    }
  };

  const renderHorizontalItem = ({ item }) => {
    return (
      <View style={styles.horizontalFlatlistItem}>
        <Ionicons name="person" size={25} color="black" />
      </View>
    );
  };

  const renderVerticalItem = ({ item }) => {
    return (
      <View style={styles.verticalFlatListItem}>
        <Text>{item.name}</Text>
      </View>
    );
  };

  const endFlingEventHandler = (event) => {
    Animated.timing(yAxis, {
      toValue: toggleModal ? -280 : 0,
      duration: 700,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    setToggleModal(!toggleModal);
  };

  const toggleNumberOfLines = () => {
    setShowFullText(!showFullText);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.descriptionContainer}>
        <Text style={{ fontSize: 25 }}>Description</Text>
        <Text numberOfLines={showFullText ? 20 : 10}>{description}</Text>

        <Text
          onPress={toggleNumberOfLines}
          style={{ lineHeight: 21, marginTop: hp("2%"), color: "blue" }}
        >
          {showFullText ? "Read less..." : "Read more..."}
        </Text>
      </View>

      <View style={styles.horizontalFlatlistContainer}>
        <FlatList
          data={visibleData}
          initialNumToRender={4}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          renderItem={renderHorizontalItem}
          onEndReached={loadMoreItems}
          onEndReachedThreshold={0.1}
          style={{ maxWidth: "100%" }}
          showsHorizontalScrollIndicator={false}
        />
        <Text style={styles.countTextStyle}>{remainingCount}</Text>
      </View>

      <FlingGestureHandler
        direction={Directions.UP | Directions.DOWN}
        onEnded={endFlingEventHandler}
      >
        <Animated.View
          style={[
            styles.gestureAnimatedView,
            { transform: [{ translateY: yAxis }] },
          ]}
        >
          {!toggleModal ? (
            <Ionicons name="chevron-down" size={30} />
          ) : (
            <Ionicons name="chevron-up" size={30} />
          )}
        </Animated.View>
      </FlingGestureHandler>

      <Animated.View
        style={[
          styles.flatlistAnimatedView,
          {
            transform: [{ translateY: yAxis }],
            height: toggleModal
              ? showFullText
                ? hp("20%")
                : hp("45%")
              : showFullText
              ? hp("60%")
              : hp("80%"),
          },
        ]}
      >
        <FlatList
          ref={verticalFlatListRef}
          data={verticalFlatListData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderVerticalItem}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: hp("8%"),
    maxWidth: Dimensions.get("screen").width,
    alignItems: "center",
    height: Dimensions.get("screen").height,
  },
  descriptionContainer: {
    paddingLeft: wp("10%"),
  },
  flatlistAnimatedView: {
    width: wp("100%"),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: hp("2%"),
  },
  gestureAnimatedView: {
    width: wp("100%"),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9eabc5",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  horizontalFlatlistContainer: {
    flexDirection: "row",
    height: hp("12%"),
    paddingRight: 20,
  },
  verticalFlatListItem: {
    minHeight: hp("6.5%"),
    width: wp("80%"),
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    justifyContent: "center",
  },
  horizontalFlatlistItem: {
    margin: wp("4%"),
    backgroundColor: "#deeff5",
    height: hp("6.5%"),
    width: hp("6.5%"),
    borderRadius: hp("6.5%") / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  countTextStyle: {
    alignSelf: "center",
    marginVertical: hp("1%"),
    paddingLeft: wp("3%"),
    fontSize: 20,
    fontWeight: "bold",
  },
});
