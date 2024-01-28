return (
  <ScrollView style={styles.outerContainer}>
    {hasZeroRating ? (
      // Loading view when there's a rating of zero in the history
      <View style={styles.loadingContainer}>
        <View style={styles.innerContainer}>
            <Text style={styles.historyText}>Current Posture</Text>
            <Text style={styles.dataRating}>Rating: {postureRating}°C</Text>
            <Text style={styles.dataComment}>{postureComment}</Text>
          </View>
        <Text style={styles.loadingText}>Gathering posture readings...</Text>
        <ActivityIndicator size="large" />
      </View>
    ) : (
      // Display humidity data
      <>
        <View style={styles.middleContainer}>
          <View style={styles.innerContainer}>
            <Text style={styles.historyText}>Current Posture</Text>
            <Text style={styles.dataRating}>Rating: {postureRating}°C</Text>
            <Text style={styles.dataComment}>{postureComment}</Text>
          </View>
          <View style={styles.innerContainer}>
            <View style={styles.averageRatingContainer}>
              <Text style={styles.dataRating}>Average Rating: {Math.round(averageRating)}°C</Text>
              <Text style={styles.dataComment}>{averageComment}</Text>
            </View>    
          </View>
        </View>

        <ScrollView horizontal>
          <View style={styles.historyContainer}>
            <Text style={styles.historyText}>History</Text>
            <LineChart
              data={{
                labels: postureHistory.map((item) => item.time),
                datasets: [
                  {
                    data: postureHistory.map((item) => item.rating),
                  },
                ],
              }}
              width={350}
              height={220}
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
            />
          </View>

          {postureHistory.length >= 10 && (
            <View style={{ marginBottom: 20, borderRadius: 20 }}>
              <LineChart
                data={{
                  labels: [], // Empty array for blank labels
                  datasets: [
                    {
                      data: postureHistory.map((item) => item.rating),
                    },
                  ],
                }}
                width={windowWidth - 84}
                height={200}
                chartConfig={{
                  backgroundGradientFrom: 'lightblue',
                  backgroundGradientTo: 'lightblue',
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  formatYLabel: (value) => `${value}`,
                  decimalPlaces: 0,
                }}
                style={{ paddingRight: 30, borderColor: "black", borderWidth: 1, borderRadius: 20 }}
              />
            </View>
          )}

          <View style={styles.historyContainer}>
            <Text style={styles.historyText}>History List</Text>
            <FlatList
              data={postureHistory.slice().reverse()}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.historyDataContainer}>
                  <Text style={styles.dataRating}>{`Posture Readings: ${item.rating !== null ? `${item.rating}°C` : 0}`}</Text>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </>
    )}
  </ScrollView>
);