import { Box, Heading, Input, Button } from '@chakra-ui/react'
import React, { useState } from 'react'

const BanTopics = () => {

  const [topic, setTopic] = useState("");

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
  };

  const handleBanTopic = () => {
    // implement topic banning logic here
    console.log(`Banning topic: ${topic}`);
  };

  return (
    <div>
      <Box mb={20}>
        <Box mb={10}>
          <Heading textAlign={'center'}>
            Ban Topics
          </Heading>
        </Box>
        <Box w={['100%', '80%']} maxW='750px' mx='auto'>
          <Input placeholder='Enter topic to ban' value={topic} onChange={handleTopicChange} w='70%' mr={4} />
          <Button colorScheme='red' onClick={handleBanTopic} w='20%'>Ban</Button>
        </Box>
      </Box>
    </div>
  )
}

export default BanTopics
