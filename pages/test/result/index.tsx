import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Option, AsyncData, Result } from "@swan-io/boxed";
import { Flex, Show, Text, VStack, Container, Heading, Box, Button, Icon, Badge } from "@chakra-ui/react";
import { FaLock, FaShoppingBag, FaCheckCircle } from "react-icons/fa";

import MainLayout from "../../../components/layouts/main-layout";
import TestResult from "../../../components/test/test-result";
import TestResultTableOfContent from "../../../components/test/test-result-table-of-content";
import TestResultStats from "../../../components/test/test-result-stats";
import {
  TestResult as ITestResult,
  getSavedTestResult,
} from "../../../lib/personality-test";
import { verifyToken } from "../../../lib/token";

export default function TestResultPage() {
  const router = useRouter();

  const [testResult, setTestResult] = useState<
    AsyncData<Result<Option<ITestResult>, Error>>
  >(AsyncData.NotAsked());

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (router.isReady) {
      const phone = router.query.phone as string;
      const token = router.query.token as string;

      const verifyRes = verifyToken(phone, token);
      setIsAuthorized(verifyRes.valid);

      if (verifyRes.valid) {
        setTestResult(AsyncData.Loading());

        const id = parseInt(router.query.testResultId as string);

        getSavedTestResult(id).tap((result) =>
          setTestResult(AsyncData.Done(result))
        );
      }
    }
  }, [router.isReady, router.query]);

  if (isAuthorized === false) {
    return (
      <MainLayout>
        <Container maxW="container.sm" py={12}>
          <VStack
            bg="white"
            p={8}
            borderRadius="2xl"
            shadow="xl"
            spacing={6}
            align="center"
            textAlign="center"
          >
            <Box p={4} bg="red.50" borderRadius="full" color="red.500">
              <Icon as={FaLock} w={10} h={10} />
            </Box>

            <Heading size="lg" color="gray.800">
              完整测评报告已加锁
            </Heading>

            <Text color="gray.600" fontSize="md">
              抱歉，您需要拥有<b>小红书订单专属授权凭证</b>才能查看该份 MBTI 深度分析报告。
            </Text>

            <VStack w="full" spacing={3}>
              <Button
                as="a"
                href="/admin/demo-fulfillment"
                colorScheme="purple"
                size="lg"
                w="full"
                leftIcon={<Icon as={FaShoppingBag} />}
              >
                前往小红书模拟发货控制台
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                w="full"
              >
                返回首页
              </Button>
            </VStack>
          </VStack>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideBackground={true}>
      <VStack w="full" spacing={0}>
        <Box w="full" bg="green.50" py={2} borderBottom="1px solid" borderColor="green.200" textAlign="center">
          <Badge colorScheme="green" fontSize="xs" px={2} py={1}>
            <Icon as={FaCheckCircle} mr={1} boxSize={3} />
            已成功核销小红书买家凭证 (手机号: {router.query.phone || "未设置"})
          </Badge>
        </Box>
        {testResult.match({
          NotAsked: () => <Text p={6}>加载中...</Text>,
          Loading: () => <Text p={6}>加载中...</Text>,
          Done: (result) =>
            result.match({
              Error: () => <Text p={6}>出现错误！请刷新页面！</Text>,
              Ok: (value) =>
                value.match({
                  Some: (data) => (
                    <Flex
                      w="full"
                      h="full"
                      direction={{
                        base: "column",
                        lg: "row",
                      }}
                    >
                      <TestResultStats testResult={data} />
                      <TestResult testResult={data} />
                      <Show above="lg">
                        <TestResultTableOfContent />
                      </Show>
                    </Flex>
                  ),
                  None: () => <Text p={6}>没有找到测试数据</Text>,
                }),
            }),
        })}
      </VStack>
    </MainLayout>
  );
}

