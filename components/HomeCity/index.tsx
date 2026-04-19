import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@config';
import TextInput from '../TextInput';
import Text from '../Text';
import styles from './styles';
import { API_BASE_URL } from '../../appConfig';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { container } from '@services';
import { handleUnauthorizedError } from '../../utils/unauthorizedHandler';
import { AutocompleteModal, AutocompleteOption, FetchOptionsFn } from '../Autocomplete';

interface City {
  name: string;
  placeId: string;
}

interface HomeCityProps {
  placeholder: string;
  searchString: string;
  style?: any;
  onCitySelect: (city: City) => void;
  onChangeText: (text: string) => void;
}

export default function HomeCity({
  placeholder, 
  searchString: value, 
  style, 
  onCitySelect,
  onChangeText,
}: HomeCityProps) {

  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const [homeCity, setHomeCity] = useState(value || '');
  const [homeCityId, setHomeCityId] = useState('');
  const [success, setSuccess] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Update homeCity when searchString prop changes
  useEffect(() => {
    if (value) {
      setHomeCity(value);
      setSuccess(true);
    }
  }, [value]);

  const searchCities: FetchOptionsFn = async (searchTerm: string) => {
    if (searchTerm.length < 3) {
      return [];
    }

    try {
      const response = await container.getAuthService().authenticatedFetch(
        `${API_BASE_URL}/api/v1/location/search?q=${encodeURIComponent(searchTerm)}`,
        {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${container.getAuthService().getAccessToken()}`
          }
        }
      );
      
      const data = await response.json();
      
      return data.cities.map((city: City) => ({
        id: city.placeId,
        label: city.name,
        value: city.placeId
      }));
    } catch (error) {
      if(handleUnauthorizedError(error, dispatch, navigation)) {
        return [];
      }
      
      console.error('Error fetching cities:', error);
      throw new Error('Unable to fetch cities. Please check your connection.');
    }
  };

  const handleCitySelect = (option: AutocompleteOption) => {
    const city: City = {
      name: option.label,
      placeId: option.id,
    };
    
    onCitySelect(city);
    setHomeCity(city.name);
    setHomeCityId(city.placeId);
    setSuccess(true);
    setModalVisible(false);
  };

  const handleChangeText = (text: string) => {
    onChangeText(text);
    setHomeCityId('');
    setHomeCity(text);
    setSuccess(false);
  };

  const handleEndEditing = () => {
    setSuccess(homeCityId !== '');
  };

  const handleInputPress = () => {
    setModalVisible(true);
  };

  return (
    <View style={[style, {width: '100%'}]}>
      <TouchableOpacity onPress={handleInputPress} activeOpacity={0.7}>
        <TextInput
          placeholder={placeholder}
          success={success}
          value={homeCity}
          onChangeText={handleChangeText}
          onEndEditing={handleEndEditing}
          editable={false}
        />
      </TouchableOpacity>

      <AutocompleteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title=""
        placeholder={`Enter ${placeholder.toLowerCase()}`}
        fetchOptions={searchCities}
        onSelect={handleCitySelect}
        debounceMs={300}
        minChars={3}
        testID="home-city-autocomplete"
      />
    </View>
  );
} 