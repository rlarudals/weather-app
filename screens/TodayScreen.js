import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { getCurrnetDate } from "../src/commonUtil";

const WEATHER_API_KEY = "1eaf2ee30cdb4ab05ef34c95e1a81a3b";

const TodayScreen = () => {
  const [location_S, setLocation_S] = useState(null);
  const [errMsg_S, setErrMsg_S] = useState(``);

  const [viewDate, setViewDate] = useState(`0000. 00. 00 (0)`);
  const [viewTime, setViewTime] = useState(`00:00`);

  const [currentTemp, setCurrentTemp] = useState(`0`);
  const [currentCity, setCurrentCity] = useState(``);

  const [minTemp, setMinTemp] = useState(`0`);
  const [maxTemp, setMaxTemp] = useState(`0`);

  const [weatherStatus, setWeatherStatus] = useState(``);

  setInterval(() => {
    const { currentDate, currentTime } = getCurrnetDate();

    setViewDate(currentDate);
    setViewTime(currentTime);
  }, 1000);

  useEffect(() => {
    const { currentDate, currentTime } = getCurrnetDate();

    setViewDate(currentDate);
    setViewTime(currentTime);

    (async () => {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== "granted") {
        setErrMsg_S("Refuse Permission This Device.");
        return;
      }

      const locData = await Location.getCurrentPositionAsync({});
      setLocation_S(locData);

      try {
        const weather = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${locData.coords.latitude}&lon=${locData.coords.longitude}&appid=${WEATHER_API_KEY}&units=metric`
        )
          .then((res) => {
            return res.json();
          })
          .then((json) => {
            const temp = String(json.main.temp).split(".")[0];
            const minTemp = String(json.main.temp_min).split(".")[0];
            const maxTemp = String(json.main.temp_max).split(".")[0];

            setCurrentCity(json.name);
            setCurrentTemp(temp);
            setMinTemp(minTemp);
            setMaxTemp(maxTemp);

            const status = json.weather[0].description;

            switch (status) {
              case "clear sky":
                setWeatherStatus("????????? ?????????. ????????? ??????????");
                break;
              case "moderate rain":
                setWeatherStatus("?????? ?????? ?????????. ????????? ????????????????");
                break;
              case "few clouds":
                setWeatherStatus("?????? ????????????. ?????? ???????????????.");
                break;
              case "scattered clouds":
                setWeatherStatus("????????? ?????????. ????????? ???????????????.");
                break;
              case "broken clouds":
                setWeatherStatus("?????? ??? ?????? ?????????. ????????? ???????????????.");
                break;
              case "shower rain":
                setWeatherStatus("?????? ???????????????. ????????? ????????????.");
                break;
              case "rain":
                setWeatherStatus("?????? ???????????????. ????????? ????????????.");
                break;
              case "thunderstorm":
                setWeatherStatus("????????? ???????????????. ????????? ???????????????.");
                break;
              case "snow":
                setWeatherStatus("?????? ????????????? ?????? ?????? ?????????.");
                break;
              case "mist":
                setWeatherStatus("????????? ????????????. ???????????????.");
                break;
            }
          });
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.box_1}>
        <Text style={styles.timeText}>{viewTime}</Text>
        <Text style={styles.dateText}>{viewDate}</Text>
      </View>
      <View style={styles.box_2}>
        <Text style={styles.statusText}>{weatherStatus}</Text>
        <Text style={styles.tempText}>{currentTemp}??C</Text>
        <View style={styles.tempUnderLine}></View>
      </View>
      <View style={styles.box_3}>
        <Text style={styles.cityText}>{currentCity}</Text>
      </View>
      <View style={styles.box_4}>
        <View style={styles.box_4_box}>
          <Text style={styles.tempGuideText}>????????????</Text>
          <Text style={styles.minMaxTemp}>{minTemp}??C</Text>
        </View>
        <View style={styles.box_4_box}>
          <Text style={styles.tempGuideText}>????????????</Text>
          <Text style={styles.minMaxTemp}>{maxTemp}??C</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  box_1: {
    flex: 2,
    width: `100%`,
    flexDirection: `column`,
    alignItems: "center",
    justifyContent: "center",
  },

  dateText: {
    fontSize: 19,
    color: `#34495e`,
  },

  timeText: {
    fontSize: 34,
    fontWeight: `700`,
  },

  statusText: {
    marginBottom: 100,
    color: `#333`,
    fontSize: 18,
  },

  box_2: {
    flex: 2.5,
    width: `100%`,
    flexDirection: `column`,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  tempText: {
    fontWeight: `500`,
    fontSize: 90,
  },

  tempUnderLine: {
    width: `70%`,
    height: 5,
    backgroundColor: `#333`,
    borderRadius: 20,
    marginTop: -10,
  },

  box_3: {
    flex: 1,
    width: `100%`,
    flexDirection: `column`,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  cityText: {
    fontSize: 20,
    fontWeight: `500`,
    color: `#888`,
  },

  box_4: {
    flex: 2,
    width: `100%`,
    flexDirection: `row`,
    alignItems: "center",
    justifyContent: "space-around",
  },

  box_4_box: {
    width: `40%`,
    height: `100%`,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  tempGuideText: {
    fontSize: 26,
    fontWeight: `500`,
    padding: 5,
  },

  minMaxTemp: {
    fontWeight: `400`,
    fontSize: 20,
  },
});

export default TodayScreen;
