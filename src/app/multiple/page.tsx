'use client'

import { Flex } from '../../../styled-system/jsx'
import { MultipleContainers } from '@/components/MultipleContainers'

export default function Home() {
  return (
    <Flex w="100vw" bg="gray.200" h="100vh" align="center" justify="center">
      <MultipleContainers />
    </Flex>
  )
}
