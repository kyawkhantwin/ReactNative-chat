import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Empty = ({text}) => {
  return (
    <View style={style.container}>
      <Text style={{textTransform:"capitalize",color:"gray"}} >{text}</Text>
    </View>
  )
}
const style = StyleSheet.create({
    container:{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height:200
    }
})

export default Empty