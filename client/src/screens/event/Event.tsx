import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { getCategories } from '../../api/category';
import { searchEvents } from '../../api/event';
import SearchBar from '../../components/common/SearchBar';
import AppContainer from '../../components/containers/AppContainer';
import FlatListItem from '../../components/custom/EventItem';
import { EventItem, Props } from '../../constants/types';
import { useEvents } from '../../helpers/EventHelper';

const Event = ({ navigation }: Props) => {
  const { events, loading, refreshEvents } = useEvents();
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<EventItem[]>([]);
  const [categories, setCategories] =
    useState<{ key: string; value: string }[]>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchCategories = async () => {
    const res = await getCategories();
    if (!res.success) {
      return Toast.show({
        type: 'error',
        text1: 'Failed to fetch categories',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
    }
    setCategories(res.data);
  };

  useEffect(() => {
    setResults(events);
  }, [events]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOnChange = (text: string) => {
    setQuery(text);
  };

  const handleClear = () => {
    setQuery('');
    setResults(events);
  };

  const handleOnSubmit = async () => {
    if (query.trim() === '' && !selectedCategory) {
      setResults(events);
      return;
    }

    const response = await searchEvents(query, selectedCategory ?? undefined);
    if (!response.success) {
      return;
    }

    setResults(response.data);
  };

  const renderItem = ({ item }: { item: EventItem }) => (
    <FlatListItem
      item={item}
      onPress={() => navigation.navigate('EventDetails', { event: item })}
    />
  );

  const renderCategory = ({
    item,
  }: {
    item: { key: string; value: string };
  }) => {
    return (
      <View style={styles.categoryItem}>
        <Text
          style={[
            styles.categoryText,
            selectedCategory === item.key && { fontWeight: 'bold' },
          ]}
          onPress={() => handleCategorySelect(item.key)}
        >
          {item.value}
        </Text>
      </View>
    );
  };

  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setQuery('');
      setResults(events);
    } else {
      setSelectedCategory(category);
      setQuery('');
      fetchFilteredEvents(category);
    }
  };

  const fetchFilteredEvents = async (category: string) => {
    const response = await searchEvents('', category);
    if (response.success) {
      setResults(response.data);
    }
  };

  return (
    <AppContainer navigation={navigation}>
      <SearchBar
        placeholder='Search Events'
        onChangeText={handleOnChange}
        onSubmitEditing={handleOnSubmit}
        onClear={handleClear}
        value={query}
      />
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.key}
        style={styles.categoryList}
      />
      {results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString() || item.name}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshEvents} />
          }
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-Regular',
              color: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            No events found
          </Text>
        </View>
      )}
    </AppContainer>
  );
};

export default Event;

const styles = StyleSheet.create({
  categoryList: {
    maxHeight: 40,
    marginHorizontal: 12,
    marginVertical: 5,
  },
  categoryItem: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: 'rgba(42, 114, 255, 0.15)',
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#2A29FF',
  },
});
