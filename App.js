/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Router, Scene, Stack, Actions} from 'react-native-router-flux';
import axios from 'axios';
import {Button} from 'react-native-elements';

const apiKey = 'GMJKpYp91Fd2zj1VSpDVgSrb826Wj1U7lHurycCd';

const getAsteroidIdInfo = async (id) => {
  const res = await axios.get(
    `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${apiKey}`,
    // 'https://api.nasa.gov/neo/rest/v1/neo/3542519?api_key=DEMO_KEY',
  );
  console.log(res);
  return res;
};

const browseToAsteroids = async () => {
  const res = await axios.get(
    `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=DEMO_KEY`,
  );

  return res;
};

const StartPage = ({setInfo}) => {
  const [value, setValue] = useState('');
  const [pendingObj, setpendingObj] = useState({
    pending: false,
    error: false,
    succes: false,
  });

  const onInputHandler = (text) => {
    setValue(text);
    setpendingObj({...pendingObj, error: false});
  };

  const onClickhandler = async () => {
    setpendingObj({...pendingObj, pending: true});
    try {
      const info = await getAsteroidIdInfo(value);
      setpendingObj({...pendingObj, succes: true, pending: false});
      setInfo({...info.data});
      Actions.infoPage();
    } catch (err) {
      setpendingObj({...pendingObj, error: true, pending: false});
    }
  };

  const onRandomHandler = async () => {
    setpendingObj({...pendingObj, pending: true});
    try {
      const res = await browseToAsteroids();
      const asteroids = res.data.near_earth_objects;
      const randomAsteroidId =
        asteroids[Math.round(Math.random() * asteroids.length)].id;
      const info = await getAsteroidIdInfo(randomAsteroidId);
      setpendingObj({...pendingObj, succes: true, pending: false});
      setInfo({...info.data});
      Actions.infoPage();
    } catch (err) {
      setpendingObj({...pendingObj, error: true, pending: false});
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={[styles.error, {display: pendingObj.error ? 'flex' : 'none'}]}>
        Asteroid not found
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Asteroid ID"
        value={value}
        onChangeText={onInputHandler}
        keyboardType="numeric"
      />
      <View style={styles.btnGroup}>
        <Button
          title="Submit"
          disabled={!value}
          onPress={onClickhandler}
          loading={!!value && pendingObj.pending}
        />
        <Button title="Random Asteroid" onPress={onRandomHandler} />
      </View>
    </SafeAreaView>
  );
};

const InfoPage = ({asteroidInfo}) => {
  console.log(asteroidInfo);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoLine}>
        <Text style={styles.infoLabel}>name</Text>
        <Text style={styles.infoText}>{asteroidInfo.name}</Text>
      </View>
      <View style={styles.infoLine}>
        <Text style={styles.infoLabel}>nasa_jpl_url</Text>
        <Text style={styles.infoText}>{asteroidInfo.nasa_jpl_url}</Text>
      </View>
      <View style={styles.infoLine}>
        <Text style={styles.infoLabel}>is_potentially_hazardous_asteroid</Text>
        <Text style={styles.infoText}>
          {asteroidInfo.is_potentially_hazardous_asteroid.toString()}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const App = () => {
  const [asteroidInfo, setInfo] = useState({});
  return (
    <Router>
      <Stack key="root">
        <Scene
          key="startPage"
          component={(props) => <StartPage {...props} setInfo={setInfo} />}
          initial
          title="Home"
        />
        <Scene
          key="infoPage"
          component={(props) => (
            <InfoPage {...props} asteroidInfo={asteroidInfo} />
          )}
          title="Info"
        />
      </Stack>
    </Router>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  btnGroup: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  input: {
    backgroundColor: 'white',
  },
  infoText: {
    color: 'white',
  },
  error: {
    color: 'red',
  },
  infoLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: 'blue',
  },
});

export default App;
