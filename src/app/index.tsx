import { useSelector } from 'react-redux';
import { Text, View, styled } from 'tamagui';

import { RootState } from '../store';

const StyledView = styled(View, {
  flex: 1,
  backgroundColor: '$background',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledText = styled(Text, {
  color: '$primary',
  fontSize: 24,
  fontWeight: 'bold',
});

export default function Index() {
  const theme = useSelector(
    (state: RootState) => state.app.theme
  );

  return (
    <StyledView>
      <StyledText>
        Welcome to Velora!
      </StyledText>

      <Text style={{ marginTop: 20 }}>
        Current Theme: {theme}
      </Text>
    </StyledView>
  );
}