import React from 'react';
import { Button } from '@mui/material';

class HomePage extends React.Component {
    constructor() {
        super();
    }

  render() {
      return(
            <div>
            <View position="absolute" bottom='0' left='10'>
            <Button variant="outlined" href="#outlined-buttons">
              Link
            </Button>
            </View>
            </div>
        );
  }
}

export default HomePage;
