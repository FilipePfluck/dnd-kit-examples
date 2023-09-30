'use client'

import { Sortable } from '@/components/Sortable'
import { Flex } from '../../styled-system/jsx'

export default function Home() {
  return (
    <Flex w="100vw" bg="gray.200" h="100vh" align="center" justify="center">
      <Sortable />
    </Flex>
  )
}
