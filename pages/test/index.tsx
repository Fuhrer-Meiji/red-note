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
import { FaMobileAlt, FaArrowRight, FaBrain, FaClock, FaCheckCircle, FaExclamationTriangle, FaLock } from "react-icons/fa";
import MainLayout from "../../components/layouts/main-layout";
import TestDisplay from "../../components/test/test-display";
import { generateToken, verifyToken, VerifyResult, MAX_USAGE_COUNT } from "../../lib/token";

export default function TestPage() {
  const router = useRouter();
  const toast = useToast();
  const [phone, setPhone] = useState("");
  const [isReadyToTest, setIsReadyToTest] = useState(false);
  const [activePhone, setActivePhone] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [remainingUses, setRemainingUses] = useState<number>(MAX_USAGE_COUNT);

  useEffect(() => {
    if (!router.isReady) return;

    const urlPhone = (router.query.phone as string) || "";
    const urlToken = (router.query.token as string) || "";

    if (urlPhone) {
      setActivePhone(urlPhone);
      const tokenToVerify = urlToken || generateToken(urlPhone);
      const verifyRes = verifyToken(urlPhone, tokenToVerify);

      if (verifyRes.valid) {
        setIsReadyToTest(true);
        setRemainingUses(verifyRes.remainingUses ?? MAX_USAGE_COUNT);
        setAuthError(null);
      } else {
        setIsReadyToTest(false);
        setAuthError(verifyRes.reason || "凭证已作废或失效");
      }
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
    const verifyRes = verifyToken(cleanPhone, token);

    if (verifyRes.valid) {
      setActivePhone(cleanPhone);
      setIsReadyToTest(true);
      setRemainingUses(verifyRes.remainingUses ?? MAX_USAGE_COUNT);
      setAuthError(null);
      router.replace(`/test?phone=${cleanPhone}&token=${token}`, undefined, { shallow: true });
    } else {
      setIsReadyToTest(false);
      setAuthError(verifyRes.reason || "凭证已作废或超过 48 小时有效期");
    }
  };

  // 1. 已激活权限：渲染清爽的答题界面
  if (isReadyToTest) {
    return (
      <MainLayout>
        <VStack w="full" spacing={2} pb={6}>
          <HStack bg="purple.50" py={1.5} px={4} borderRadius="full" border="1px solid" borderColor="purple.200">
            <Icon as={FaCheckCircle} color="green.500" />
            <Text fontSize="xs" color="purple.800" fontWeight="bold">
              凭证核销成功 (手机号: {activePhone} | 48小时内有效 | 剩余可用次数: {remainingUses}/{MAX_USAGE_COUNT})
            </Text>
          </HStack>
          <TestDisplay />
        </VStack>
      </MainLayout>
    );
  }

  // 2. 作废/超过48小时/次数用完拦截提示卡片
  if (authError) {
    return (
      <MainLayout>
        <Container maxW="container.sm" py={{ base: 8, md: 12 }}>
          <VStack
            bg="white"
            p={{ base: 6, md: 8 }}
            borderRadius="2xl"
            shadow="xl"
            spacing={6}
            align="center"
            textAlign="center"
          >
            <Box p={4} bg="red.50" borderRadius="full" color="red.500">
              <Icon as={FaLock} w={10} h={10} />
            </Box>

            <Heading size="md" color="gray.800">
              测评凭证已作废 / 失效
            </Heading>

            <Box p={4} bg="red.50" borderRadius="xl" border="1px solid" borderColor="red.200" w="full">
              <Text color="red.700" fontWeight="bold" fontSize="sm">
                ❌ {authError}
              </Text>
            </Box>

            <Text fontSize="xs" color="gray.500">
              提示：每份测评凭证最多允许测试 <b>2 次</b>，且需在下单后 <b>48 小时内</b>完成。
            </Text>

            <Button
              colorScheme="purple"
              size="lg"
              w="full"
              onClick={() => {
                setAuthError(null);
                router.replace("/test");
              }}
            >
              更换手机号重新输入
            </Button>
          </VStack>
        </Container>
      </MainLayout>
    );
  }

  // 3. 默认输入手机号验证卡片
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
              <Text fontSize="xs" fontWeight="bold" color="gray.700">48小时内有效(限2次)</Text>
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
            🔒 每单凭证 48 小时内有效，最多允许测试 2 次
          </Text>
        </VStack>
      </Container>
    </MainLayout>
  );
}
