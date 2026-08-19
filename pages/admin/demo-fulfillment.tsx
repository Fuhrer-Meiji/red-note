import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
  Text,
  Badge,
  useToast,
  Link,
  Code,
  Divider,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { FaMobileAlt, FaLink, FaMagic, FaExternalLinkAlt } from "react-icons/fa";
import MainLayout from "../../components/layouts/main-layout";

export default function DemoFulfillmentAdmin() {
  const [phone, setPhone] = useState("13812345678");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const toast = useToast();

  const handleSimulateFulfillment = async () => {
    if (!phone || phone.length < 11) {
      toast({
        title: "请输入正确的11位手机号",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/webhook/red", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: `RED_ORD_${Math.floor(100000 + Math.random() * 900000)}`,
          phone: phone.trim(),
          testType: "mbti_personality",
          customOrigin: typeof window !== "undefined" ? window.location.origin : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        toast({
          title: "专属链接生成成功！",
          status: "success",
          duration: 3000,
        });
      } else {
        toast({
          title: "生成失败",
          description: data.message,
          status: "error",
        });
      }
    } catch (err: any) {
      toast({
        title: "请求异常",
        description: err.message,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container maxW="container.sm" py={{ base: 6, md: 10 }}>
        <VStack spacing={6} align="stretch" bg="white" p={{ base: 6, md: 8 }} borderRadius="2xl" shadow="xl">
          <VStack spacing={1} textAlign="center">
            <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
              小红书商家发货控制台
            </Badge>
            <Heading size="md" color="gray.800" pt={2}>
              生成买家专属测试链接
            </Heading>
            <Text fontSize="xs" color="gray.500">
              输入买家小红书下单手机号，自动生成直达 MBTI 答题页面的专属链接
            </Text>
          </VStack>

          <Divider />

          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={2} color="gray.700">
              📱 买家手机号：
            </Text>
            <HStack spacing={3}>
              <Input
                size="lg"
                type="tel"
                maxLength={11}
                placeholder="请输入11位手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                borderRadius="xl"
                focusBorderColor="purple.500"
              />
              <Button
                colorScheme="purple"
                size="lg"
                px={6}
                borderRadius="xl"
                isLoading={loading}
                leftIcon={<Icon as={FaMagic} />}
                onClick={handleSimulateFulfillment}
              >
                生成链接
              </Button>
            </HStack>
          </Box>

          {result && (
            <Box mt={4} p={5} bg="purple.50" borderRadius="xl" border="1px solid" borderColor="purple.200">
              <VStack align="stretch" spacing={3}>
                <HStack justify="space-between">
                  <Badge colorScheme="green" fontSize="xs">
                    ✅ 专属 H5 链接生成完毕
                  </Badge>
                  <Text fontSize="xs" color="gray.500">
                    手机号: {result.phone}
                  </Text>
                </HStack>

                <Box bg="white" p={3} borderRadius="lg" border="1px dashed" borderColor="purple.300">
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    🔗 买家专属测试链接（点击复制或在手机打开）：
                  </Text>
                  <Link
                    href={result.quizLink}
                    color="purple.600"
                    fontSize="sm"
                    fontWeight="bold"
                    isExternal
                    wordBreak="break-all"
                  >
                    {result.quizLink}
                  </Link>
                </Box>

                <Button
                  as="a"
                  href={result.quizLink}
                  target="_blank"
                  colorScheme="purple"
                  size="md"
                  borderRadius="lg"
                  rightIcon={<Icon as={FaExternalLinkAlt} />}
                  shadow="sm"
                >
                  🚀 手机/浏览器点此直接进入答题界面
                </Button>
              </VStack>
            </Box>
          )}
        </VStack>
      </Container>
    </MainLayout>
  );
}
