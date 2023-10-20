import React from 'react';
import { Text, View, SafeAreaView, TextInput, Image, Pressable, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from "react";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles.js';
import fetchHistory from './FetchHistory';

// global var for checking if addStats submitted
let submitCheck = false;

// add game to async storage
// addHistory(message, playerGoals, playerAssis, plus, pim, count, goals, 1, 0, 0);
const addHistory = async (messageToAdd, goalsToAdd, assistToAdd, plusToAdd, pimToAdd, myScoreToAdd, oppScoreToAdd, winToAdd, lossToAdd, otToAdd) => {
  try{
    let currentList = await AsyncStorage.getItem('totalList');
    // Initialize currentList as an empty array if it's null
    currentList = currentList ? JSON.parse(currentList) : [];
    const newList = [messageToAdd, goalsToAdd, assistToAdd, plusToAdd, pimToAdd, myScoreToAdd, oppScoreToAdd, winToAdd, lossToAdd, otToAdd];
    currentList.push(newList);
    await AsyncStorage.setItem('totalList', JSON.stringify(currentList));
  }
  catch (error) {
    console.error('Error updating:', error);
  }
};

// add all stats to async storage
// addTotalGoals(playerGoals, playerAssis, plus, pim, win, loss, OTL, hattrick);
const addTotalGoals = async (goalsToAdd, assistToAdd, plusToAdd, pimToAdd, winToAdd, lossToAdd, otToAdd) => {
  try {
    // Retrieve the current stats value
    let currentList = await AsyncStorage.getItem('statList')
    // Initialize stat list as all zeroes if its null
    currentList = currentList ? JSON.parse(currentList) : [0, 0, 0, 0, 0, 0, 0, 0];
    currentList[0] = currentList[0] + goalsToAdd;
    currentList[1] = currentList[1] + assistToAdd;
    currentList[2] = currentList[2] + plusToAdd;
    currentList[3] = currentList[3] + pimToAdd;
    currentList[4] = currentList[4] + winToAdd;
    currentList[5] = currentList[5] + lossToAdd;
    currentList[6] = currentList[6] + otToAdd;
    // hat trick
    if (goalsToAdd >= 3){
      currentList[7]++;
    }
    console.log(currentList);
    await AsyncStorage.setItem('statList', JSON.stringify(currentList));
  } 
  catch (error) {
    console.error('Error updating:', error);
  }
};

const fetchStats = async() => {
    // Retrieve the current stat value
    const currentTotalGoalsString = await AsyncStorage.getItem('statList');
    // array string
    const currentTotalGoals = JSON.parse(currentTotalGoalsString);
    // return the stats
    return currentTotalGoals;
};

function SubmitCheck(){
  submitCheck = true;
}
function IsSubmitCheckTrue() {
  return submitCheck;
}

// Home Screen
function HomeScreen({ navigation }){

  const [isSaved, setIsSaved] = useState(IsSubmitCheckTrue());
  // timer for data saved display, 5 seconds
  useEffect(() => {
    let timer;
    if (isSaved) {
      timer = setTimeout(() => {
        setIsSaved(false);
      }, 5000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isSaved]);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('./assets/helmet.png')}
        style={{ width: 150, height: 150 }}
      />
      <Text style={styles.title}>Hockey Stat Tracker</Text>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.Pbutton} onPress={() => navigation.navigate('Add Stats', { goalInit: 0, assisInit: 0, plusInit: 0, pimInit: 0, finalYouInit: 0, finalOppInit: 0, messageInit: null, WLInit: null, WLMessage: null })} >
            <Text style={styles.text}>Add Stats</Text>
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.Pbutton} onPress={() => navigation.navigate('All Stats')} >
          <Text style={styles.text}>Stats</Text>
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.Pbutton} onPress={() => navigation.navigate('Game History')} >
          <Text style={styles.text}>History</Text>
        </Pressable>
      </View>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
      {isSaved ? (
        <View style={{ backgroundColor: '#007AFF', padding: 20, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{ fontSize: 15, color: 'white' }}>Game Data Saved</Text>
        </View>
      ) : null}
    </View>

    </SafeAreaView>
  );
}

// add stats screen
function AddScreen({ route}) {

  const navigation = useNavigation();

  const { goalInit, assisInit, plusInit, pimInit, finalYouInit, finalOppInit, messageInit, WLInit, WLMessage  } = route.params;

  const [count, setCount] = useState(assisInit);
  
  const [goals, setGoals] = useState(goalInit);

  const [plus, setPlus] = useState(plusInit);

  const [pim, setPim] = useState(pimInit);

  // decrement and increment assist
  function decrementCount(){
    if (count > 0) {
      setCount(prevCount => prevCount - 1);
    }
  }
  function incrementCount(){
    setCount(prevCount => prevCount + 1);
  }
  // decrement and increment goals
  function decrementGoals(){
    if (goals > 0){
      setGoals(prevGoals => prevGoals - 1);
    }
  }
  function incrementGoals(){
    setGoals(prevGoals => prevGoals + 1);
  }
  // decrement and increment plus minus
  function decrementPlus(){
    setPlus(prevPlus => prevPlus - 1);
  }
  function incrementPlus(){
    setPlus(prevPlus => prevPlus + 1);
  }
  // decrement and increment penalty minutes
  function decrementPim(){
    if (pim > 0){
      setPim(prevPim => prevPim - 1);
    }
  }
  function incrementPim(){
    setPim(prevPim => prevPim + 1);
  }

  return (

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      
    <Text style={[styles.textAdd, { fontSize: 20, marginBottom: 20}]}>Goals:</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
      <View style={styles.container}>
	      <TouchableOpacity 
	            style={[styles.floatingButton, {right: 20}]}
	            onPress={decrementGoals}>
		    <Icon name="minus" size={40} color="black" />
	      </TouchableOpacity>
      </View>


      <Text style={[styles.textCounter, { fontSize: 35 }]}>{goals}</Text>
      
      <View style={styles.container}>
	      <TouchableOpacity 
	            style={[styles.floatingButton, {left: 20}]}
	            onPress={incrementGoals}>
		    <Icon name="plus" size={40} color="black" />
	      </TouchableOpacity>
      </View>
    </View>


    <Text style={[styles.textAdd, { marginTop: 10, fontSize: 20, marginBottom: 20}]}>Assists:</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>

      <View style={styles.container}>
	      <TouchableOpacity 
	            style={[styles.floatingButton, {right: 20}]}
	            onPress={decrementCount}>
		    <Icon name="minus" size={40} color="black" />
	      </TouchableOpacity>
      </View>

      <Text style={[styles.textCounter, { fontSize: 35 }]}>{count}</Text>
        
        <View style={styles.container}>
	      <TouchableOpacity 
            style={[styles.floatingButton, { left: 20 }]}
            onPress={incrementCount}>
		    <Icon name="plus" size={40} color="black" />
	      </TouchableOpacity>
      </View>
    </View>


    <Text style={[styles.textAdd, { marginTop: 10, fontSize: 20, marginBottom: 20}]}>+/-</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>

      <View style={styles.container}>
	      <TouchableOpacity 
	            style={[styles.floatingButton, {right: 20}]}
	            onPress={decrementPlus}>
		    <Icon name="minus" size={40} color="black" />
	      </TouchableOpacity>
      </View>

      <Text style={[styles.textCounter, { fontSize: 35 }]}>{plus}</Text>
        
        <View style={styles.container}>
	      <TouchableOpacity 
            style={[styles.floatingButton, { left: 20 }]}
            onPress={incrementPlus}>
		    <Icon name="plus" size={40} color="black" />
	      </TouchableOpacity>
      </View>
    </View>

    <Text style={[styles.textAdd, { marginTop: 10, fontSize: 20, marginBottom: 20}]}>PIM</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>

      <View style={styles.container}>
	      <TouchableOpacity 
	            style={[styles.floatingButton, {right: 20}]}
	            onPress={decrementPim}>
		    <Icon name="minus" size={40} color="black" />
	      </TouchableOpacity>
      </View>

      <Text style={[styles.textCounter, { fontSize: 35 }]}>{pim}</Text>
        
        <View style={styles.container}>
	      <TouchableOpacity 
            style={[styles.floatingButton, { left: 20 }]}
            onPress={incrementPim}>
		    <Icon name="plus" size={40} color="black" />
	      </TouchableOpacity>
      </View>
    </View>


    <Pressable style={[styles.Pbutton, {marginTop: 70 }]} onPress={() => navigation.navigate("Team Stats", { goalInit: goals, assisInit: count, plusInit: plus, pimInit: pim, finalYouInit: finalYouInit, finalOppInit: finalOppInit, messageInit: messageInit, WLInit: WLInit, WLMessage: WLMessage  })} >
    <Text style={[styles.textAdd, {color: 'white'}]}>
      Switch to Team Stats</Text>
    </Pressable>
    </View> 
  );
}

// Team Stats and Submit
function TeamStats({route}){

  const { goalInit, assisInit, plusInit, pimInit, finalYouInit, finalOppInit, messageInit, WLInit, WLMessage } = route.params;

  const navigation = useNavigation();

  const [message, setMessage] = useState('');

  const [count, setCount] = useState(finalOppInit);
  
  const [goals, setGoals] = useState(finalYouInit);

  const [playerGoals, setPlayerGoals] = useState(goalInit);

  const [playerAssis, setPlayerAssis] = useState(assisInit);

  const [plus, setPlus] = useState(plusInit);

  const [pim, setPim] = useState(pimInit);

  const [selectedOption, setSelectedOption] = useState(WLMessage);

  const [isMessageDone, setMessageDone] = useState(false);

  const [isWLDone, setWLDone] = useState(WLInit);

  useEffect(() => {
    if (messageInit != null) {
      setMessage(messageInit);
      setMessageDone(true);
    }
  }, [messageInit]);
  // decrement and increment shots
  function decrementCount(){
    if (count > 0) {
      setCount(prevCount => prevCount - 1);
    }
  }
  function incrementCount(){
    setCount(prevCount => prevCount + 1)
  }
  // decrement and increment goals
  function decrementGoals(){
    if (goals > 0){
      setGoals(prevGoals => prevGoals - 1);
    }
  }
  function incrementGoals(){
    setGoals(prevGoals => prevGoals + 1)
  }
  // win or loss buttons
  const handleWinPress = () => {
    setSelectedOption('regulation');
    setWLDone(true);
  };

  const handleLosePress = () => {
    setSelectedOption('overtime');
    setWLDone(true);
  };
  // textbox
  const handleTextChange = (text) => {
    setMessage(text);
    setMessageDone(true);
  };

  // submit button is pressed
  const handleSubmit = () => {
    if (isMessageDone == true && isWLDone == true) {
      console.log(playerAssis);
      // { goalInit: goalInit, assistInit: assisInit, plusInit: plusInit, pimInit: pimInit, finalYouInit: count, finalOppInit: goals, messageInit: message }
      if (count < goals){
        // win
        addTotalGoals(playerGoals, playerAssis, plus, pim, 1, 0, 0);
        addHistory(message, playerGoals, playerAssis, plus, pim, count, goals, 1, 0, 0);
      } else if (count > goals && selectedOption === 'regulation'){
        // lose
        addTotalGoals(playerGoals, playerAssis, plus, pim, 0, 1, 0);
        addHistory(message, playerGoals, playerAssis, plus, pim, count, goals, 0, 1, 0);
      } else {
        // overtime lose
        addTotalGoals(playerGoals, playerAssis, plus, pim, 0, 0, 1);
        addHistory(message, playerGoals, playerAssis, plus, pim, count, goals, 0, 0, 1);
      }
      setGoals(0);
      setCount(0);
      setPlus(0);
      setPim(0);
      setPlayerGoals(0);
      setPlayerAssis(0);
      setSelectedOption(null);
      setMessage("");
      setWLDone(false);
      setMessageDone(false);
      SubmitCheck();
      navigation.navigate("Home", { HomeScreen });
    }
  }

  return (

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={styles.textAdd}>Enter Opponent Here:</Text>
        <TextInput
          placeholder="Opposing team"
          value={message}
          onChangeText={handleTextChange}
          style={[styles.input, { marginBottom: 20 }]}
      />
      <Text style={[styles.textAdd, { marginBottom: 20 }]}>Final Score:</Text>
      <Text style={[styles.textAdd, { marginBottom: 15 }]}>You</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
      <View style={styles.container}>
	      <TouchableOpacity 
	            style={[styles.floatingButton, {right: 20}]}
	            onPress={decrementGoals}>
		    <Icon name="minus" size={40} color="black" />
	      </TouchableOpacity>
      </View>

      <Text style={[styles.textCounter, { fontSize: 30 }]}>{goals}</Text>
      
      <View style={styles.container}>
	      <TouchableOpacity 
	            style={[styles.floatingButton, {left: 20}]}
	            onPress={incrementGoals}>
		    <Icon name="plus" size={40} color="black" />
	      </TouchableOpacity>
      </View>
    </View>

    <Text style={[styles.textAdd, { marginBottom: 15 }]}>Opponent</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>

      <View style={styles.container}>
	      <TouchableOpacity 
	            style={[styles.floatingButton, {right: 20}]}
	            onPress={decrementCount}>
		    <Icon name="minus" size={40} color="black" />
	      </TouchableOpacity>
      </View>

      <Text style={[styles.textCounter, { fontSize: 30 }]}>{count}</Text>
        
        <View style={styles.container}>
	      <TouchableOpacity 
            style={[styles.floatingButton, { left: 20 }]}
            onPress={incrementCount}>
		    <Icon name="plus" size={40} color="black" />
	      </TouchableOpacity>
        </View>
      </View>

      <View style={styles.winLose}>
    
      <Pressable style={[styles.WLbutton, { backgroundColor: selectedOption === 'regulation' ? 'black' : 'gray', right: 5 }]} onPress={handleWinPress}>
        <Text style={[styles.textAdd, {color: 'white'}]}>Regulation</Text>  
      </Pressable>  

      <Pressable style={[styles.WLbutton, { backgroundColor: selectedOption === 'overtime' ? 'black' : 'gray', left: 5 }]} onPress={handleLosePress}>
        <Text style={[styles.textAdd, {color: 'white'}]}>Overtime</Text>
      </Pressable>
    </View>

    <View style={styles.winLose}>
      <Pressable style={[styles.PbuttonAdd, {backgroundColor: isMessageDone == true && isWLDone == true ? 'black' : 'gray'}]} 
      onPress={() => { handleSubmit();}}>
        <Text style={[styles.textAdd, {color: 'white'}]}>Submit</Text>
      </Pressable>
    </View>
    <Pressable style={[styles.Pbutton, {marginTop: 50}]} onPress={() => navigation.navigate("Add Stats", { goalInit: playerGoals, assistInit: playerAssis, plusInit: plus, pimInit: pim, finalYouInit: goals, finalOppInit: count, messageInit: message, WLInit: isWLDone, WLMessage: selectedOption })} >
      <Text style={[styles.textAdd, {color: 'white'}]}>
      Switch to Player Stats</Text>
    </Pressable>
    </View>
  );
}

// stats screen
function Stats({ navigation }) {

  // playerGoals, playerAssis, plus, pim, win, loss, OTL, hattrick
  const [statsAgain, setStatsAgain] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    // Fetch the stats when the component mounts
    async function fetchData() {
      try {
        const stats = await fetchStats();
        if (stats === null) {
          // Set a default value when stats are null
          setFetchedData([0, 0, 0, 0, 0, 0, 0, 0]);
        } else {
          setFetchedData(stats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchData();
  }, []);
  
  useEffect(() => {
    // Update statsAgain whenever stats changes
    setStatsAgain([
      { category: 'Goals', value: fetchedData[0] },
      { category: 'Assist', value: fetchedData[1] },
      { category: 'Plus Minus', value: fetchedData[2] },
      { category: 'PIM', value: fetchedData[3] },
      { category: 'Win', value: fetchedData[4] },
      { category: 'Loss', value: fetchedData[5] },
      { category: 'Overtime Losses', value: fetchedData[6] },
      { category: 'HatTrick', value: fetchedData[7] },
    ]);
  }, [fetchedData]);

  const renderStatItem = ({ item }) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{isNaN(item.value) ? '0' : item.value}</Text>
      <Text style={styles.statsCategory}>{item.category}</Text>
    </View>
  );

    return (
      <View style={styles.containerStats}>
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>My Goalie</Text>
            <Text style={styles.userFollowers}>Record: {fetchedData[4]} - {fetchedData[5]} - {fetchedData[6]}</Text>
          </View>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Seasons Stats</Text>
          <FlatList
            data={statsAgain}
            renderItem={renderStatItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
        </View>
      </View>
    );
  }; 


// history screen
function History({ navigation }) {

  const [fetchedHistoryStats, setFetchedHistoryStats] = useState([]); // Initialize as an empty array

  useEffect(() => {
    // Fetch the stats when the component mounts
    async function fetchDataHistory() {
      try {
        const historyStats = await fetchHistory();
        setFetchedHistoryStats(historyStats.totalList); // Set the value in component state
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }
    fetchDataHistory();
  }, []);

  const handleClick = (teamHistory) => {
    const exactGame = teamHistory;
    console.log('exact game', exactGame);
    navigation.navigate('Game Stats', {exactGame});
  }
  // addHistory(message, playerGoals, playerAssis, plus, pim, count, goals, 1, 0, 0);
  let data = [];
  let teamName, goals, assists, plus, pim, yourGoals, oppoGoals, wins, loss, otl;
  for(var i = 0; i < fetchedHistoryStats.length; i++){
    console.log(fetchedHistoryStats[i]);
    [teamName, goals, assists, plus, pim, oppoGoals, yourGoals, wins, loss, otl] = fetchedHistoryStats[i];
    data[i] = {
      teamHistory: [teamName, goals, assists, plus, pim, yourGoals, oppoGoals, wins, loss, otl],
      descriptionHistory: `${teamName}: ${yourGoals} - ${oppoGoals}`,
      winLoss: wins ? 'W' : 'L',
    };
  }  

  return (
    <View style={styles.containerHistory}>

      <FlatList
        style={styles.notificationListHistory}
        enableEmptySections={true}
        data={data.reverse()}
        renderItem={({ item }) => {
          return (
            <Pressable style={styles.notificationBoxHistory} onPress={() => handleClick(item.teamHistory)}>
              <Text style={styles.winLossText}>{item.winLoss}</Text>
              <Text style={styles.descriptionHistory}>{item.descriptionHistory}</Text>
            </Pressable>
          )
        }}
      />
    </View>
  )
}

// stats screen
function GameStat({ route }) {
    const [stats, setStats] = useState({
      totalGoals: 0,
      totalAssis: 0,
      totalPlus: 0,
      totalPim: 0,
      totalGoalFor: 0,
      totalGoalAgainst: 0,
      totalWins: 0,
      totalLose: 0,
      totalOTL: 0,
    });
  
    const [statsAgain, setStatsAgain] = useState([]);
    const {exactGame} = route.params;
    const outcome = exactGame[7] === 1 ? 'Win' : exactGame[8] === 1 ? 'Loss' : exactGame[9] === 1 ? 'OTL' : '';
    console.log(outcome);

    useEffect(() => {
    // addHistory(message, playerGoals, playerAssis, plus, pim, count, goals, 1, 0, 0);
      setStatsAgain([
        { category: 'Goals', value: exactGame[1]},
        { category: 'Assists', value: exactGame[2] },
        { category: 'Points', value: exactGame[1] + exactGame[2] },
        { category: 'Plus Minus', value: exactGame[3] },
        { category: 'PIM', value: exactGame[4] },
        { category: 'Outcome', value: outcome},
      ]);
    }, [stats]);


  console.log("in game stat function", exactGame);
  // Assuming fetchedHistoryStats is [3, 8, 1, 0, 'fdkfmsf']
  const renderGameItem = ({ item }) => (
    <View style={styles.statItem}>
    <Text style={styles.statValue}>{typeof item.value === 'number' ? item.value : String(item.value)}</Text>
      <Text style={styles.statsCategory}>{item.category}</Text>
    </View>
  );

    return (
      <View style={styles.containerStats}>
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{exactGame[0]}</Text>
            <Text style={styles.userFollowers}></Text>
          </View>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Game Stats</Text>
          <FlatList
            data={statsAgain}
            renderItem={renderGameItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
        </View>
      </View>
    );
  };


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Add Stats" component={AddScreen} />
        <Stack.Screen name="All Stats" component={Stats} />
        <Stack.Screen name="Game History" component={History} />
        <Stack.Screen name="Game Stats" component={GameStat} />
        <Stack.Screen name="Team Stats" component={TeamStats} />
      </Stack.Navigator> 
    </NavigationContainer>
  );
}

export default App;