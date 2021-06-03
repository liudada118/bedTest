import React from 'react';
import { StyleSheet, View, Button, Text, ScrollView, Image } from 'react-native';
import Plotly from 'react-native-plotly';
import { smooth } from '../js/smooth'
import { time } from '../js/time';
import axios from 'axios'
import WS from 'react-native-websocket'
let bodytaMove = [0]
let breath = [0]
let leaveBed = [0]
let bodytaMoveArr = [], breathArr = [], leaveBedArr = []
let i = 0
let x = [0]
let xArr = []
let pointNum = 15
let number = 0
export default class App extends React.Component {
  state = {
    data: [],
    data1: [],
    data2: [],
    layout: { title: '体动' },
    layout1: { title: '呼吸' },
    layout2: { title: '离床' },
    sleep: '平躺',
    leave: 1
  };



  componentDidMount() {
    const url = 'ws://sensor.bodyta.com:8888/bed/f4cfa29692f8'
    const otherurl = 'ws://sensor.bodyta.com:8888/bed/40f52071f5d4'
    const ws = new WebSocket(url)
    // const ws = new WebSocket('ws://sensor.bodyta.com:8888/bed/40f52071f5d4')
    
    ws.onopen = (e) => { 
      console.log(url)
      this.setState({leave : 0})
    }
    ws.onmessage = (e) => {
      number ++
      const wsData = JSON.parse(e.data)
      this.setState({ leave: wsData.leaveBed })
      console.log(wsData)
      if (bodytaMove.length <= pointNum) {
        bodytaMove.push(wsData.bodytaMove)
        i += 4
        // if (!x.includes(time(wsData.time))) {
        //   x.push(time(wsData.time))
        // } else if (x.includes(time(wsData.time))) {
        //   if (x.includes(`${time(wsData.time)}:20`)) {
        //     x.push(`${time(wsData.time)}:40`)
        //   } else {
        //     x.push(`${time(wsData.time)}:20`)
        //   }


        // }
        x.push(`${time(wsData.time)}:${number}`)

        // xArr = smooth(x)
        bodytaMoveArr = smooth(bodytaMove)
      } else {
        bodytaMove.push(wsData.bodytaMove)
        bodytaMove.shift()
        i += 4
        x.push(`${time(wsData.time)}:${number}`)
        x.shift()
        // xArr = smooth(x)
        bodytaMoveArr = smooth(bodytaMove)
      }

      if (breath.length <= pointNum) {
        breath.push(wsData.breath)
        breathArr = smooth(breath)
      } else {
        breath.push(wsData.breath)
        breath.shift()
        breathArr = smooth(breath)
      }

      if (leaveBed.length <= pointNum) {
        leaveBed.push(wsData.leaveBed)
        leaveBedArr = smooth(leaveBed)
      } else {
        leaveBed.push(wsData.leaveBed)
        leaveBed.shift()
        leaveBedArr = smooth(leaveBed)

      }
      let data = {
        __id: 'down',
        x: x,
        y: bodytaMove,
        type: 'scatter',
      }
      const onUrl = 'http://cloudml.bodyta.com/predict/bedPost'
      const unUrl = 'http://192.168.31.117:9090/predict/bed'
      axios({ method: 'post', headers: { appKey: '50ea2b2f913d', appSecret: 'q93Zhn/vqqaEQOD7MC8fQg==' }, data: { 'instances': [wsData.data] }, url: onUrl })
        .then(res => {
          this.setState({ sleep: res.data.data })
          console.log(res.data.data,url)
        })
      let data1 = {
        __id: 'down',
        x: x,
        y: breath,
        type: 'scatter',
      }
      let data2 = {
        __id: 'down',
        x: x,
        y: leaveBed,
        type: 'scatter',
      }
      this.setState({ data: [data], data1: [data1], data2: [data2] })
    }
    ws.onerror = (e) =>{
      console.log(e , 'err')
    }
  }


  render() {
    return (
      <ScrollView style={{ height: '100%' }}>
       
        <View style={styles.container}>
          <Text>1.状态测试</Text>
          <View style={styles.row}>
            <View style={[styles.hlafCard, { marginRight: 5, backgroundColor: this.state.leave == 0 ? 'green' : '#fff' }]}>
              <View>
                <Text style={{ fontSize: 20, marginBottom: 10 }}>在床</Text>
                <Text style={{ fontSize: 16, }}>00:11:08</Text>
              </View>
            </View>
            <View style={[styles.hlafCard, { marginLeft: 5, backgroundColor: this.state.leave == 1 ? 'green' : '#fff' }]}>
              <View>
                <Text style={{ fontSize: 20, marginBottom: 10 }}>离床</Text>
                <Text style={{ fontSize: 16, }}>00:11:08</Text>
              </View>
            </View>
          </View>
          <Text>2.体动</Text>
          <View style={styles.chartRow}>
            <Plotly
              data={this.state.data}
              layout={this.state.layout}
              update={this.update}
              onLoad={() => console.log('loaded')}
              debug
              enableFullPlotly
            />


          </View>


          <Text>3.呼吸</Text>
          <View style={styles.chartRow}>
            <Plotly
              data={this.state.data1}
              layout={this.state.layout1}
              update={this.update}
              onLoad={() => console.log('loaded')}
              debug
              enableFullPlotly
            />
          </View>
          <Text>4.离床</Text>
          <View style={styles.chartRow}>
            <Plotly
              data={this.state.data2}
              layout={this.state.layout2}
              update={this.update}
              onLoad={() => console.log('loaded')}
              debug
              enableFullPlotly
            />
          </View>
          <Text>5.睡姿测试</Text>
          <View style={[styles.row,]}>
            <View style={[styles.hlafCard1, { marginRight: 5 }]}>
              <Image
                style={{ width: 100, height: 170, display: this.state.sleep == '平躺' ? 'flex' : 'none' }}
                source={require('../assets/image/up.png')}
              />
              <Image
                style={{ width: 100, height: 170, display: this.state.sleep == '侧躺' ? 'flex' : 'none' }}
                source={require('../assets/image/left.jpg')}
              />
              <Image
                style={{ width: 100, height: 170, display: this.state.sleep == '爬睡' ? 'flex' : 'none' }}
                source={require('../assets/image/prone.png')}
              />
              <Image
                style={{ width: 100, height: 170, display: this.state.sleep == '右侧' ? 'flex' : 'none' }}
                source={require('../assets/image/right.png')}
              />
              <Image
                style={{ width: 100, height: 170, display: this.state.sleep == '其他' ? 'flex' : 'none' }}
                source={require('../assets/image/other.png')}
              />
            </View>
            <View style={[styles.row, { flex: 1, marginLeft: 5 }]}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <View>
                  <Text style>睡姿</Text>
                  <Text>左侧睡</Text>
                  <Text>右侧睡</Text>
                  <Text>俯睡</Text>
                  <Text>仰卧</Text>
                  <Text>活动</Text>
                  <Text>坐/站</Text>
                  <Text>其他</Text>
                </View>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text>次数</Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
              </View>
            </View>
          </View>
          
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  hlafCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20
  },
  hlafCard1: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  buttonRow: {
    flexDirection: 'row'
  },
  chartRow: {
    height: 300,
    width: '100%'
  },
  container: {
    paddingTop: 30,
    height: '100%',
    margin: 20
  }
});