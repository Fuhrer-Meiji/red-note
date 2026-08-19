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
  Spinner,
} from "@chakra-ui/react";
import { FaArrowRight, FaBrain, FaClock, FaCheckCircle, FaLock, FaSync } from "react-icons/fa";
import MainLayout from "../../components/layouts/main-layout";
import TestDisplay from "../../components/test/test-display";
import { MAX_USAGE_COUNT } from "../../lib/token";

export default function TestPage() {
  const router = useRouter();
  const toast = useToast();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReadyToTest, setIsReadyToTest] = useState(false);
  const [activePhone, setActivePhone] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [remainingUses, setRemainingUses] = useState<number>(MAX_USAGE_COUNT);

  useEffect(() => {
    if (!router.isReady) return;

    const urlPhone = (router.query.phone as string) || "";
    const urlToken = (router.query.token as string) || "";

    if (urlPhone) {
      verifyPhoneAndToken(urlPhone, urlToken);
    }
  }, [router.isReady, router.query]);

  // 后端真实验证逻辑
  const verifyPhoneAndToken = async (phoneToVerify: string, tokenToVerify?: string) => {
    setLoading(true);
    setAuthError(null);

    try {
      const res = await fetch(`/api/auth/verify?phone=${encodeURIComponent(phoneToVerify)}&token=${encodeURIComponent(tokenToVerify || "")}`);
      const data = await res.json();

      if (data.valid) {
        setActivePhone(phoneToVerify);
        setIsReadyToTest(true);
        setRemainingUses(data.remainingUses ?? MAX_USAGE_COUNT);
        setAuthError(null);
      } else {
        setIsReadyToTest(false);
        setAuthError(data.message || data.reason || "未查询到小红书付款订单！");
      }
    } catch (err: any) {
      setIsReadyToTest(false);
      setAuthError("验证网络连接失败，请刷新重试");
    } finally {
      setLoading(false);
    }
  };

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
    verifyPhoneAndToken(cleanPhone);
  };

  // 加载状态中
  if (loading) {
    return (
      <MainLayout>
        <VStack justify="center" h="60vh" spacing={4}>
          <Spinner size="xl" color="purple.500" thickness="4px" />
          <Text color="gray.600" fontSize="sm">正在查询小红书订单核销凭证...</Text>
        </VStack>
      </MainLayout>
    );
  }

  // 1. 已激活权限：渲染答题界面
  if (isReadyToTest) {
    return (
      <MainLayout>
        <VStack w="full" spacing={2} pb={6}>
          <HStack bg="purple.50" py={1.5} px={4} borderRadius="full" border="1px solid" borderColor="purple.200">
            <Icon as={FaCheckCircle} color="green.500" />
            <Text fontSize="xs" color="purple.800" fontWeight="bold">
              小红书订单核销成功 (手机号: {activePhone} | 48小时有效 | 剩余可用次数: {remainingUses}/{MAX_USAGE_COUNT})
            </Text>
          </HStack>
          <TestDisplay />
        </VStack>
      </MainLayout>
    );
  }

  // 2. 拦截提示卡片（未付款手机号 / 已作废 / 超过48小时）
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
              未检测到已付款订单 / 凭证已作废
            </Heading>

            <Box p={4} bg="red.50" borderRadius="xl" border="1px solid" borderColor="red.200" w="full">
              <Text color="red.700" fontWeight="bold" fontSize="sm">
                ❌ {authError}
              </Text>
            </Box>

            <Text fontSize="xs" color="gray.500">
              提示：必须是在小红书店铺真实下单的手机号才能开启测评。
            </Text>

            <VStack w="full" spacing={3}>
              <Button
                colorScheme="purple"
                size="lg"
                w="full"
                leftIcon={<Icon as={FaSync} />}
                onClick={() => {
                  setAuthError(null);
                  router.replace("/test");
                }}
              >
                重新输入手机号
              </Button>
            </VStack>
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
              <Text fontSize="xs" fontWeight="bold" color="gray.700">24 道精选题目</Text>
            </VStack>
            <VStack spacing={1}>
              <Icon as={FaClock} color="purple.500" boxSize={5} />
              <Text fontSize="xs" fontWeight="bold" color="gray.700">小红书已付款核销</Text>
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
                placeholder="请输入小红书下单的 11 位手机号"
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
                isLoading={loading}
                rightIcon={<Icon as={FaArrowRight} />}
                onClick={handleStartWithPhone}
                shadow="md"
                _hover={{ transform: "translateY(-1px)", shadow: "lg" }}
              >
                核销订单并开始测试
              </Button>
            </VStack>
          </Box>

          <Text fontSize="xs" color="gray.400" textAlign="center">
            🔒 只有小红书已下单买家手机号可开启测评
          </Text>
        </VStack>
      </Container>
    </MainLayout>
  );
}
