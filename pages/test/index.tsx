import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  Icon,
  Badge,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { FaMobileAlt, FaArrowRight, FaBrain, FaClock, FaCheckCircle } from "react-icons/fa";
import MainLayout from "../../components/layouts/main-layout";
import TestDisplay from "../../components/test/test-display";
import { generateToken } from "../../lib/token";

export default function TestPage() {
  const router = useRouter();
  const toast = useToast();
  const [phone, setPhone] = useState("");
  const [isReadyToTest, setIsReadyToTest] = useState(false);
  const [activePhone, setActivePhone] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    const urlPhone = (router.query.phone as string) || "";
    const urlToken = (router.query.token as string) || "";

    // 如果 URL 中携带了手机号，直接放行进入测试！
    if (urlPhone) {
      setActivePhone(urlPhone);
      setIsReadyToTest(true);
    }
  }, [router.isReady, router.query]);

  // 手动输入手机号校验进入
  const handleStartWithPhone = () => {
    if (!phone || phone.trim().length < 11) {
      toast({
        title: "请输入正确的11位手机号",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const cleanPhone = phone.trim();
    const token = generateToken(cleanPhone);
    setActivePhone(cleanPhone);
    setIsReadyToTest(true);

    // 更新 URL，方便刷新保存状态
    router.replace(`/test?phone=${cleanPhone}&token=${token}`, undefined, { shallow: true });
  };

  // 1. 已激活权限：直接渲染清爽的答题界面
  if (isReadyToTest) {
    return (
      <MainLayout>
        <VStack w="full" spacing={2} pb={6}>
          <HStack bg="purple.50" py={1.5} px={4} borderRadius="full" border="1px solid" borderColor="purple.200">
            <Icon as={FaCheckCircle} color="green.500" />
            <Text fontSize="xs" color="purple.800" fontWeight="bold">
              已验证买家凭证 (手机号: {activePhone})
            </Text>
          </HStack>
          <TestDisplay />
        </VStack>
      </MainLayout>
    );
  }

  // 2. 未带参数时：呈现简约高颜值的手机号验证登录框，输入手机号即刻开始！
  return (
    <MainLayout>
      <Container maxW="container.sm" py={{ base: 6, md: 12 }}>
        <VStack
          bg="white"
          p={{ base: 6, md: 8 }}
          borderRadius="2xl"
          shadow="2xl"
          spacing={6}
          align="stretch"
        >
          <VStack spacing={2} textAlign="center">
            <Badge colorScheme="purple" px={3} py={1} borderRadius="full" fontSize="xs">
              ✨ 小红书店铺专属 MBTI 测试
            </Badge>
            <Heading size="lg" color="gray.800">
              16 型人格深度测评
            </Heading>
            <Text color="gray.500" fontSize="sm">
              只需 5 分钟，解锁你的性格特征、高匹配恋爱与适合职业
            </Text>
          </VStack>

          <HStack justify="space-around" bg="purple.50" p={4} borderRadius="xl">
            <VStack spacing={1}>
              <Icon as={FaBrain} color="purple.500" boxSize={5} />
              <Text fontSize="xs" fontWeight="bold" color="gray.700">70 道专业题目</Text>
            </VStack>
            <VStack spacing={1}>
              <Icon as={FaClock} color="purple.500" boxSize={5} />
              <Text fontSize="xs" fontWeight="bold" color="gray.700">约 3-5 分钟</Text>
            </VStack>
          </HStack>

          <Box pt={2}>
            <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={2}>
              📱 请输入在小红书下单的手机号：
            </Text>
            <VStack spacing={4}>
              <Input
                size="lg"
                type="tel"
                maxLength={11}
                placeholder="请输入 11 位手机号码"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                focusBorderColor="purple.500"
                borderRadius="xl"
              />

              <Button
                colorScheme="purple"
                size="lg"
                w="full"
                height="54px"
                borderRadius="xl"
                fontSize="md"
                fontWeight="bold"
                rightIcon={<Icon as={FaArrowRight} />}
                onClick={handleStartWithPhone}
                shadow="md"
                _hover={{ transform: "translateY(-1px)", shadow: "lg" }}
              >
                立即开始测试
              </Button>
            </VStack>
          </Box>

          <Text fontSize="xs" color="gray.400" textAlign="center">
            🔒 凭证用于核销小红书订单及生成专属测试报告
          </Text>
        </VStack>
      </Container>
    </MainLayout>
  );
}
