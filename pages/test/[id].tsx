// filepath: pages/test/[id].tsx
import { GetStaticPaths, GetStaticProps } from 'next';

interface TestPageProps {
    testId: string;
}

const TestPage: React.FC<TestPageProps> = ({ testId }) => {
    console.log(`[TestPage Component] Received testId: ${testId}`);
    if (!testId) {
        return <div>Error: testId is missing!</div>;
    }
    return <div>The ID for this test page is: {testId}</div>;
};

export const getStaticPaths: GetStaticPaths = async () => {
    console.log('[TestPage getStaticPaths] Running...');
    // For testing, we'll just pre-render one path
    const paths = [{ params: { id: 'hello' } }];
    console.log('[TestPage getStaticPaths] Returning paths:', paths);
    return { paths, fallback: false }; // Or fallback: 'blocking' or true if needed
};

export const getStaticProps: GetStaticProps<TestPageProps, { id: string }> = async (context) => {
    console.log('[TestPage getStaticProps] Running...');
    const id = context.params?.id;
    console.log('[TestPage getStaticProps] Context params:', context.params);

    if (!id) {
        console.error('[TestPage getStaticProps] ID is missing from context.params!');
        return { notFound: true };
    }

    console.log(`[TestPage getStaticProps] Processing id: ${id}`);
    const props = { testId: id };
    console.log('[TestPage getStaticProps] Returning props:', props);

    return {
        props: props,
    };
};

export default TestPage;