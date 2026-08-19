import {
  Flex,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  Badge,
  Box,
  VStack,
  Divider,
} from "@chakra-ui/react";

import {
  TestResult as ITestResult,
  getPersonalityClassGroupByTestScores,
} from "../../lib/personality-test";

interface TestResultProps {
  testResult: ITestResult;
}

export default function TestResult(props: TestResultProps) {
  const personalityClassGroup = getPersonalityClassGroupByTestScores(
    props.testResult.testScores
  );

  const displayTraits = personalityClassGroup.traits || personalityClassGroup.generalTraits || [];
  const displayStrengths = personalityClassGroup.strengths || personalityClassGroup.relationshipStrengths || [];
  const displayWeaknesses = personalityClassGroup.weaknesses || personalityClassGroup.relationshipWeaknesses || [];
  const displaySuggestions = personalityClassGroup.careerSuggestions || personalityClassGroup.suggestions || [];

  return (
    <Flex
      p={6}
      w="full"
      direction="column"
      alignItems="center"
      gap={6}
      bg="white"
      borderRadius="2xl"
      shadow="md"
    >
      <VStack spacing={2} textAlign="center">
        <Badge colorScheme="purple" px={3} py={1} borderRadius="full" fontSize="xs">
          {personalityClassGroup.groupName || "恋爱人格解析报告"}
        </Badge>
        <Heading as="h1" size="xl" color="purple.600">
          {personalityClassGroup.name}
        </Heading>
        <Text fontSize="lg" fontWeight="bold" color="gray.500">
          MBTI 型号：{personalityClassGroup.type}
        </Text>
      </VStack>

      <Box p={5} bg="purple.50" borderRadius="xl" border="1px solid" borderColor="purple.200" w="full">
        <Text fontSize="md" color="gray.700" lineHeight="tall" textAlign="justify">
          {personalityClassGroup.description}
        </Text>
      </Box>

      <Divider my={2} />

      {displayTraits.length > 0 && (
        <Box w="full">
          <Heading as="h2" size="md" color="gray.800" mb={3}>
            ✨ 恋爱核心性格特征
          </Heading>
          <UnorderedList spacing={2} color="gray.700">
            {displayTraits.map((trait: string, index: number) => (
              <ListItem key={index}>{trait}</ListItem>
            ))}
          </UnorderedList>
        </Box>
      )}

      {displayStrengths.length > 0 && (
        <Box w="full">
          <Heading as="h2" size="md" color="green.600" mb={3}>
            💖 恋爱中的致命吸引力（优势）
          </Heading>
          <UnorderedList spacing={2} color="gray.700">
            {displayStrengths.map((item: string, index: number) => (
              <ListItem key={index}>{item}</ListItem>
            ))}
          </UnorderedList>
        </Box>
      )}

      {displayWeaknesses.length > 0 && (
        <Box w="full">
          <Heading as="h2" size="md" color="red.500" mb={3}>
            ⚠️ 恋爱中的性格盲区（误区）
          </Heading>
          <UnorderedList spacing={2} color="gray.700">
            {displayWeaknesses.map((item: string, index: number) => (
              <ListItem key={index}>{item}</ListItem>
            ))}
          </UnorderedList>
        </Box>
      )}

      {displaySuggestions.length > 0 && (
        <Box w="full" p={4} bg="purple.100" borderRadius="xl">
          <Heading as="h2" size="md" color="purple.800" mb={3}>
            💘 绝配 CP 推荐与恋爱指南
          </Heading>
          <UnorderedList spacing={2} color="purple.900" styleType="none" ml={0}>
            {displaySuggestions.map((item: string, index: number) => (
              <ListItem key={index} fontWeight="bold" my={1}>
                {item}
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
      )}
    </Flex>
  );
}
