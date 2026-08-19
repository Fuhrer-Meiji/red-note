import Link from "next/link";
import { Heading, Text, Highlight, Flex, Button, Badge, VStack } from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import Image from "next/image";

import MainLayout from "../components/layouts/main-layout";

export default function HomePage() {
  return (
    <>
      <MainLayout>
        <Flex
          position="relative"
          w={{
            base: "full",
            lg: "50%",
          }}
          alignSelf="center"
          px={4}
          pt={16}
          gap={6}
          h="calc(100vh - 80px)"
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          zIndex={1}
        >
          <Badge colorScheme="purple" px={4} py={1} borderRadius="full" fontSize="xs">
            🔥 小红书爆款 · 恋爱与社交人格测评
          </Badge>
          <Heading
            as="h1"
            lineHeight="tall"
            textAlign="center"
            size="xl"
          >
            <Highlight
              query="恋爱人格"
              styles={{
                py: 1,
                px: 4,
                rounded: "full",
                bg: "purple.500",
                color: "white",
              }}
            >
              测测你的 恋爱人格 与动物类型
            </Highlight>
          </Heading>
          <Text
            fontSize="md"
            align="center"
            color="gray.600"
          >
            你是黑豹系、金毛系、灵猫系还是狐狸系恋人？
            <br />
            只需 3 分钟，解锁你的恋爱潜意识与绝配 CP！
          </Text>
          <Link href="/test">
            <Button
              w="min-content"
              colorScheme="purple"
              size="lg"
              borderRadius="xl"
              px={8}
              shadow="md"
              rightIcon={<FiArrowRight size={20} />}
            >
              立即开始测试
            </Button>
          </Link>
        </Flex>
        <Image
          alt="illustration"
          src={`/images/home-bottom.png`}
          width={100}
          height={100}
          style={{
            position: "absolute",
            zIndex: 0,
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "600px",
            height: "auto",
          }}
        />
      </MainLayout>
    </>
  );
}
