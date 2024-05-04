import {Stack} from 'expo-router';
// import MyFood from './(pages)/MyFood';
// import Search from './(pages)/Search';
const StackLayout = () => {
    return (
      <Stack>
          <Stack.Screen name="(pages)" />
      </Stack>
    //   <Stack>
    //     <Screen
    //       name="MyFood"
    //       component={MyFood}
    //       options={{ headerShown: false }}
    //     />
    //     <Screen
    //       name="Search"
    //       component={Search}
    //       options={{ headerShown: false }}
    //     />
    //     {/* Add other screens as needed */}
    //   </Stack>
    );
}