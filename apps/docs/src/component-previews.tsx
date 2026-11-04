import type { ReactNode } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Chip,
  DatePicker,
  Divider,
  EmptyState,
  Field,
  FileUpload,
  Heading,
  Icon,
  Input,
  List,
  ListItem,
  Loader,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NumberInput,
  Paginator,
  PinInput,
  ProgressBar,
  Radio,
  Rating,
  Select,
  SelectContent,
  SelectOption,
  SelectTrigger,
  Skeleton,
  Slider,
  Step,
  StepIndicator,
  StepSeparator,
  Stepper,
  StepTitle,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  TimePicker,
  Toggle,
  Tree,
  TreeItem,
  TreeItemGroup,
  TreeItemLabel,
} from 'plume-ui-react'

const noop = (): void => undefined

const row = { alignItems: 'center', display: 'flex', gap: '0.5rem' } as const
const column = { display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' } as const

const bell = (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
)

const labelled = (label: string, control: ReactNode): ReactNode => (
  <Field label={label} orientation="inline">
    {control}
  </Field>
)

const surface = (children: ReactNode, width = '13rem'): ReactNode => (
  <Card style={{ width }} variant="elevated">
    {children}
  </Card>
)

// Overlays are drawn closed in the docs, so their cards show them open with the pieces they are made of.
const previews: Record<string, ReactNode> = {
  Accordion: (
    <Accordion style={{ width: '14rem' }}>
      <AccordionItem value="one">
        <AccordionTrigger>How do I install it?</AccordionTrigger>
        <AccordionContent>With your package manager.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Can I use Tailwind?</AccordionTrigger>
        <AccordionContent>Yes.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  Alert: (
    <Alert status="success" style={{ width: '15rem' }}>
      <AlertIcon />
      <AlertContent>
        <AlertTitle>Saved</AlertTitle>
        <AlertDescription>Your changes are live.</AlertDescription>
      </AlertContent>
    </Alert>
  ),
  Avatar: (
    <div style={row}>
      <Avatar name="Ada Lovelace" />
      <Avatar colorScheme="success" name="Grace Hopper" variant="solid" />
      <Avatar colorScheme="warning" name="Alan Turing" variant="outline" />
    </div>
  ),
  Badge: (
    <div style={row}>
      <Badge>New</Badge>
      <Badge colorScheme="success">Paid</Badge>
      <Badge colorScheme="error">Overdue</Badge>
    </div>
  ),
  Breadcrumb: (
    <Breadcrumb aria-label="Path">
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Components</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
  Button: (
    <div style={row}>
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost">Skip</Button>
    </div>
  ),
  Card: surface(
    <>
      <CardHeader>Team plan</CardHeader>
      <CardBody>Everything your team needs.</CardBody>
    </>,
  ),
  Carousel: (
    <div style={{ width: '14rem' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #4f46e5, #a21caf)',
          borderRadius: '0.5rem',
          height: '4.5rem',
        }}
      />
      <div style={{ ...row, gap: '0.375rem', justifyContent: 'center', marginTop: '0.5rem' }}>
        {[0, 1, 2, 3].map((dot) => (
          <span
            key={dot}
            style={{
              background: dot === 0 ? '#4f46e5' : '#a1a1aa',
              borderRadius: '50%',
              height: '0.5rem',
              width: '0.5rem',
            }}
          />
        ))}
      </div>
    </div>
  ),
  Checkbox: (
    <div style={column}>
      {labelled('Remember me', <Checkbox defaultChecked />)}
      {labelled('Send me updates', <Checkbox />)}
    </div>
  ),
  Chip: (
    <div style={row}>
      <Chip>Design</Chip>
      <Chip variant="solid">React</Chip>
      <Chip variant="outline">A11y</Chip>
    </div>
  ),
  Collapse: (
    <div style={column}>
      <Button size="sm" variant="outline">
        Details
      </Button>
      <Card variant="outline">
        <CardBody>Plume is a set of accessible React components.</CardBody>
      </Card>
    </div>
  ),
  DatePicker: <DatePicker aria-label="Date" onValueChange={noop} style={{ width: '12rem' }} />,
  Divider: (
    <Card style={{ width: '10rem' }} variant="outline">
      <CardBody>
        <div style={{ ...column, gap: '0.75rem' }}>
          <Text>Account</Text>
          <Divider />
          <Text>Security</Text>
        </div>
      </CardBody>
    </Card>
  ),
  Drawer: (
    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '14rem' }}>
      <Card style={{ width: '8rem' }} variant="elevated">
        <CardHeader>Filters</CardHeader>
        <CardBody>
          <div style={column}>
            <Skeleton />
            <Skeleton width="70%" />
          </div>
        </CardBody>
      </Card>
    </div>
  ),
  Dropdown: (
    <div style={{ ...column, alignItems: 'flex-start', width: '9rem' }}>
      <Button size="sm" variant="outline">
        Actions
      </Button>
      <Card style={{ width: '100%' }} variant="elevated">
        <List variant="plain">
          <ListItem>Profile</ListItem>
          <ListItem>Sign out</ListItem>
        </List>
      </Card>
    </div>
  ),
  EmptyState: (
    <EmptyState
      description="Create one to get started."
      icon={bell}
      style={{ width: '14rem' }}
      title="No projects"
    />
  ),
  Field: (
    <Field helperText="We'll never share it." label="Email" style={{ width: '13rem' }}>
      <Input placeholder="you@example.com" />
    </Field>
  ),
  FileUpload: <FileUpload aria-label="Upload files">Drop files here</FileUpload>,
  Heading: (
    <div style={column}>
      <Heading level={3}>Heading</Heading>
      <Text variant="caption">The text styles of the theme</Text>
    </div>
  ),
  Icon: (
    <div style={row}>
      <Icon aria-label="Notifications" size="lg">
        {bell}
      </Icon>
      <Icon aria-label="Notifications" colorScheme="primary" size="lg">
        {bell}
      </Icon>
    </div>
  ),
  Input: <Input aria-label="Name" placeholder="Name" style={{ width: '12rem' }} />,
  List: (
    <List aria-label="Files" style={{ width: '12rem' }} variant="bordered">
      <ListItem>Annual report.pdf</ListItem>
      <ListItem>Budget.xlsx</ListItem>
    </List>
  ),
  Loader: (
    <div style={row}>
      <Loader colorScheme="primary" />
      <Loader colorScheme="primary" variant="dots" />
      <Loader colorScheme="primary" variant="bars" />
    </div>
  ),
  Modal: surface(
    <>
      <CardHeader>Delete project</CardHeader>
      <CardBody>This cannot be undone.</CardBody>
      <div style={{ ...row, justifyContent: 'flex-end', padding: '0 1rem 1rem' }}>
        <Button size="sm" variant="ghost">
          Cancel
        </Button>
        <Button colorScheme="error" size="sm">
          Delete
        </Button>
      </div>
    </>,
    '14rem',
  ),
  Navbar: (
    <Navbar aria-label="Main" style={{ width: '16rem' }}>
      <NavbarBrand href="#">Plume</NavbarBrand>
      <NavbarContent>
        <NavbarItem active href="#">
          Home
        </NavbarItem>
        <NavbarItem href="#">Docs</NavbarItem>
      </NavbarContent>
    </Navbar>
  ),
  NumberInput: <NumberInput aria-label="Quantity" defaultValue={2} style={{ width: '10rem' }} />,
  Paginator: <Paginator aria-label="Pages" defaultPage={3} total={50} />,
  PinInput: <PinInput aria-label="Code" defaultValue="42" length={4} />,
  Popover: (
    <div style={{ ...column, alignItems: 'flex-start', width: '12rem' }}>
      <Button size="sm">Open popover</Button>
      <Card variant="elevated">
        <CardBody>Anyone in the team can see this project.</CardBody>
      </Card>
    </div>
  ),
  ProgressBar: (
    <div style={{ ...column, width: '13rem' }}>
      <ProgressBar aria-label="Upload" value={65} />
      <ProgressBar aria-label="Quota" value={30} variant="striped" />
    </div>
  ),
  Radio: (
    <div style={column}>
      {labelled('Monthly', <Radio defaultChecked name="preview-plan" />)}
      {labelled('Yearly', <Radio name="preview-plan" />)}
    </div>
  ),
  Rating: <Rating aria-label="Score" defaultValue={3} />,
  Select: (
    <Select>
      <SelectTrigger aria-label="Fruit" placeholder="Pick a fruit" style={{ width: '12rem' }} />
      <SelectContent>
        <SelectOption value="apple">Apple</SelectOption>
      </SelectContent>
    </Select>
  ),
  Sidebar: (
    <Card style={{ width: '9rem' }} variant="outline">
      <List variant="plain">
        <ListItem>Home</ListItem>
        <ListItem>Projects</ListItem>
        <ListItem>Team</ListItem>
      </List>
    </Card>
  ),
  Skeleton: (
    <Card style={{ width: '14rem' }} variant="outline">
      <CardBody>
        <div style={row}>
          <Skeleton height={40} shape="circle" width={40} />
          <div style={column}>
            <Skeleton />
            <Skeleton width="60%" />
          </div>
        </div>
      </CardBody>
    </Card>
  ),
  Slider: <Slider aria-label="Volume" defaultValue={40} style={{ width: '12rem' }} />,
  Stepper: (
    <Stepper activeStep={1} aria-label="Checkout" style={{ width: '100%' }}>
      {['Cart', 'Pay', 'Done'].map((title) => (
        <Step key={title}>
          <StepIndicator />
          <StepTitle>{title}</StepTitle>
          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  ),
  Table: (
    <Table style={{ width: '14rem' }}>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Alan</TableCell>
          <TableCell>Editor</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  Tabs: (
    <Tabs style={{ width: '13rem' }}>
      <TabList>
        <Tab label="Profile" />
        <Tab label="Billing" />
      </TabList>
      <TabPanels>
        <TabPanel>
          <Text variant="body-sm">Your details.</Text>
        </TabPanel>
        <TabPanel>
          <Text variant="body-sm">Your invoices.</Text>
        </TabPanel>
      </TabPanels>
    </Tabs>
  ),
  Text: (
    <div style={column}>
      <Text>Body text</Text>
      <Text variant="label">Label</Text>
      <Text variant="caption">Caption</Text>
    </div>
  ),
  Textarea: <Textarea aria-label="Comments" placeholder="Comments" rows={3} style={{ width: '12rem' }} />,
  TimePicker: <TimePicker aria-label="Time" defaultValue="09:30" style={{ width: '10rem' }} />,
  Toast: surface(
    <>
      <CardHeader>Saved</CardHeader>
      <CardBody>Your changes were saved.</CardBody>
    </>,
    '13rem',
  ),
  Toggle: (
    <div style={column}>
      {labelled('Notifications', <Toggle defaultChecked />)}
      {labelled('Dark mode', <Toggle />)}
    </div>
  ),
  Tooltip: (
    <div style={{ ...column, alignItems: 'center', width: '10rem' }}>
      <span
        style={{
          background: '#27272a',
          borderRadius: '0.375rem',
          color: '#fafafa',
          fontSize: '0.75rem',
          padding: '0.25rem 0.5rem',
        }}
      >
        Save the file
      </span>
      <Button size="sm" variant="outline">
        Save
      </Button>
    </div>
  ),
  Tree: (
    <Tree aria-label="Files" defaultExpanded={['src']} style={{ width: '10rem' }}>
      <TreeItem value="src">
        <TreeItemLabel>src</TreeItemLabel>
        <TreeItemGroup>
          <TreeItem value="app">
            <TreeItemLabel>app.tsx</TreeItemLabel>
          </TreeItem>
          <TreeItem value="index">
            <TreeItemLabel>index.ts</TreeItemLabel>
          </TreeItem>
        </TreeItemGroup>
      </TreeItem>
    </Tree>
  ),
}

export default previews
